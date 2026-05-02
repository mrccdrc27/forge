import { useForgeStore } from '../store/forge'

/**
 * The brain of Forge.
 * This hook drives the full Bob → Orchestrate → Verify loop.
 */
export function useForgeOrchestrator() {
  const store = useForgeStore()

  // ─── Step 0: Interview / Chat ───────────────────────────────────────────
  async function chat(userMessage) {
    store.addChatMessage('user', userMessage)
    store.setBobThinking(true)
    store.clearBobStream()

    // Build context from history
    const history = store.chatHistory
      .map(m => `${m.role === 'user' ? 'User' : 'Bob'}: ${m.content}`)
      .join('\n')

    const systemPrompt = `
You are a senior product consultant for "Forge", an AI orchestration platform.
Help the user refine their software idea. 
Ask clarifying questions about the tech stack, features, or scope.
Be concise. One question at a time.
When you have enough info to build a plan, end your message with: [READY]
`.trim()

    window.forge.bob.onStream((chunk) => {
      store.appendBobStream(chunk)
    })

    const result = await window.forge.bob.run({
      prompt: userMessage,
      context: `${systemPrompt}\n\nHistory:\n${history}`
    })

    window.forge.bob.offStream()
    store.setBobThinking(false)

    if (result.success) {
      store.addChatMessage('bob', result.output)
      
      // Auto-transition to planning if Bob says [READY]
      if (result.output.includes('[READY]')) {
        return 'ready'
      }
    } else {
      store.setError(`Bob failed during chat: ${result.error}`)
    }
  }

  // ─── Step 1: Bob interviews + produces master plan ──────────────────────
  async function runPlanning(projectName, userPrompt) {
    store.setPhase('planning')
    store.setBobThinking(true)
    store.clearBobStream()

    const history = store.chatHistory
      .map(m => `${m.role === 'user' ? 'User' : 'Bob'}: ${m.content}`)
      .join('\n')

    const planningPrompt = `
You are a senior software architect. Based on the following conversation:

${history}

Produce a structured master plan for the project: "${projectName}".
Be concise and time-sensitive.
Do NOT over-engineer. Output ONLY valid JSON in this exact shape:

{
  "summary": "one sentence description",
  "stack": { "language": "...", "framework": "...", "runtime": "..." },
  "estimate": "small|medium|large",
  "tasks": [
    {
      "id": "task_1",
      "name": "short task name",
      "description": "what needs to be built",
      "type": "scaffold|feature|test|config"
    }
  ]
}

Keep tasks small and atomic. Max 6 tasks. No explanations outside the JSON.
`.trim()

    // Stream Bob's output live
    window.forge.bob.onStream((chunk) => {
      store.appendBobStream(chunk)
    })

    const result = await window.forge.bob.run({
      prompt: planningPrompt
    })

    window.forge.bob.offStream()
    store.setBobThinking(false)

    if (!result.success) {
      store.setError(`Bob failed during planning: ${result.error}`)
      return null
    }

    // Parse JSON from Bob's output
    try {
      const jsonMatch = result.output.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in Bob output')
      const plan = JSON.parse(jsonMatch[0])
      store.setMasterPlan(plan)
      await window.forge.projects.savePlan({ projectName, plan })
      return plan
    } catch (err) {
      store.setError(`Failed to parse Bob's plan: ${err.message}`)
      return null
    }
  }

  // ─── Step 2: Spawn Watson subagents for each task ────────────────────────
  async function runBuilding(plan, projectContext) {
    store.setPhase('building')
    store.clearSubagents()

    // Spawn all subagent cards immediately (show them as queued)
    plan.tasks.forEach(task => store.spawnSubagent(task))

    // Run tasks — can be parallelized or sequential depending on type
    const results = await Promise.allSettled(
      plan.tasks.map(task => runTask(task, projectContext))
    )

    return results
  }

  async function runTask(task, projectContext) {
    store.updateSubagent(task.id, { status: 'running' })

    const result = await window.forge.orchestrate.spawn({
      task,
      projectContext
    })

    if (result.success) {
      store.updateSubagent(task.id, { status: 'done', output: result.data })
    } else {
      store.updateSubagent(task.id, { status: 'failed', error: result.error })
    }

    return result
  }

  // ─── Step 3: Bob verifies the build output ──────────────────────────────
  async function runVerification(plan) {
    store.setPhase('verifying')
    store.setBobThinking(true)
    store.clearBobStream()

    const subagents = useForgeStore.getState().subagents
    const buildSummary = subagents.map(a =>
      `Task: ${a.name}\nStatus: ${a.status}\n${a.error ? `Error: ${a.error}` : `Output: ${JSON.stringify(a.output)}`}`
    ).join('\n\n---\n\n')

    const verifyPrompt = `
You are verifying a build. Here is the result of each task:

${buildSummary}

Respond ONLY with valid JSON:
{
  "passed": ["task_id_1", "task_id_2"],
  "failed": ["task_id_3"],
  "verdict": "pass" | "retry",
  "notes": "brief explanation"
}

Verdict is "pass" if all critical tasks succeeded. "retry" if any failed tasks are blocking.
`.trim()

    window.forge.bob.onStream((chunk) => store.appendBobStream(chunk))

    const result = await window.forge.bob.run({ prompt: verifyPrompt })

    window.forge.bob.offStream()
    store.setBobThinking(false)

    if (!result.success) {
      store.setError(`Bob failed during verification: ${result.error}`)
      return null
    }

    try {
      const jsonMatch = result.output.match(/\{[\s\S]*\}/)
      const report = JSON.parse(jsonMatch[0])
      store.setVerificationReport(report)
      return report
    } catch (err) {
      store.setError(`Failed to parse verification report: ${err.message}`)
      return null
    }
  }

  // ─── Main entry point ────────────────────────────────────────────────────
  async function start(projectName, userPrompt) {
    const MAX_ITERATIONS = 3
    let iteration = 0

    // 1. Plan
    const plan = await runPlanning(projectName, userPrompt)
    if (!plan) return

    const projectContext = { projectName, userPrompt, plan }

    while (iteration < MAX_ITERATIONS) {
      store.incrementIteration()
      iteration++

      // 2. Build
      await runBuilding(plan, projectContext)

      // 3. Verify
      const report = await runVerification(plan)
      if (!report) return

      if (report.verdict === 'pass') {
        store.setPhase('done')
        return
      }

      // Retry loop — only retry failed tasks
      if (iteration < MAX_ITERATIONS) {
        const failedTasks = plan.tasks.filter(t =>
          report.failed.includes(t.id)
        )
        plan.tasks = failedTasks
      }
    }

    // Hit max iterations
    store.setPhase('done')
  }

  return { chat, start }
}
