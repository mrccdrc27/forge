# 🔧 Forge Configuration Guide

## Overview

Forge now supports a flexible configuration system that eliminates hardcoded values and allows customization of all critical parameters.

## Configuration File

Create a `forge.config.json` file in your workspace root to customize Forge's behavior:

```json
{
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "watsonx": {
    "baseUrl": "https://us-south.ml.cloud.ibm.com",
    "models": {
      "reasoning": "meta-llama/llama-3-3-70b-instruct",
      "execution": "ibm/granite-3-8b-instruct"
    }
  },
  "budget": {
    "maxBobcoins": 40,
    "toolOverheadBuffer": 500,
    "costs": {
      "llama": 1.0,
      "granite": 0.1
    }
  },
  "workspace": {
    "requireWorkspaceFolder": true,
    "defaultScaffoldPath": "."
  }
}
```

## Configuration Options

### Server Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `server.port` | number | `3000` | Port for MCP SSE server |
| `server.host` | string | `"localhost"` | Host address to bind to |

**Example:**
```json
{
  "server": {
    "port": 8080,
    "host": "0.0.0.0"
  }
}
```

### Watsonx.ai Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `watsonx.baseUrl` | string | `"https://us-south.ml.cloud.ibm.com"` | IBM Watsonx.ai API endpoint |
| `watsonx.models.reasoning` | string | `"meta-llama/llama-3-3-70b-instruct"` | Model for planning/architecture tasks |
| `watsonx.models.execution` | string | `"ibm/granite-3-8b-instruct"` | Model for implementation tasks |

**Regional Endpoints:**
- US South: `https://us-south.ml.cloud.ibm.com`
- EU Germany: `https://eu-de.ml.cloud.ibm.com`
- Japan Tokyo: `https://jp-tok.ml.cloud.ibm.com`

**Example:**
```json
{
  "watsonx": {
    "baseUrl": "https://eu-de.ml.cloud.ibm.com",
    "models": {
      "reasoning": "meta-llama/llama-3-3-70b-instruct",
      "execution": "ibm/granite-3-8b-instruct"
    }
  }
}
```

### Budget Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `budget.maxBobcoins` | number | `40` | Maximum Bobcoin budget |
| `budget.toolOverheadBuffer` | number | `500` | Token buffer for MCP tool overhead |
| `budget.costs.llama` | number | `1.0` | Cost per 1k tokens for reasoning model |
| `budget.costs.granite` | number | `0.1` | Cost per 1k tokens for execution model |

**Example (Increased Budget):**
```json
{
  "budget": {
    "maxBobcoins": 100,
    "toolOverheadBuffer": 1000,
    "costs": {
      "llama": 1.0,
      "granite": 0.1
    }
  }
}
```

### Workspace Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `workspace.requireWorkspaceFolder` | boolean | `true` | Require open workspace for scaffold operations |
| `workspace.defaultScaffoldPath` | string | `"."` | Default path for scaffolding if no workspace |

**Example:**
```json
{
  "workspace": {
    "requireWorkspaceFolder": false,
    "defaultScaffoldPath": "./projects"
  }
}
```

## VS Code Settings Override

You can also override configuration via VS Code settings (`.vscode/settings.json`):

```json
{
  "forge.server.port": 3001,
  "forge.budget.maxBobcoins": 50
}
```

VS Code settings take precedence over `forge.config.json`.

## Configuration Priority

1. **VS Code Settings** (highest priority)
2. **forge.config.json** (workspace-specific)
3. **Built-in Defaults** (fallback)

## Migration from Hardcoded Values

### Before (Hardcoded)
```typescript
const port = 3000; // Fixed
const model = 'meta-llama/llama-3-3-70b-instruct'; // Fixed
```

### After (Configurable)
```typescript
const port = config.getConfig().server.port; // From config
const model = config.getConfig().watsonx.models.reasoning; // From config
```

## Common Configurations

### Development Setup
```json
{
  "server": { "port": 3000, "host": "localhost" },
  "budget": { "maxBobcoins": 100 },
  "workspace": { "requireWorkspaceFolder": false }
}
```

### Production/Demo Setup
```json
{
  "server": { "port": 3000, "host": "0.0.0.0" },
  "budget": { "maxBobcoins": 40 },
  "workspace": { "requireWorkspaceFolder": true }
}
```

### Testing with Different Models
```json
{
  "watsonx": {
    "models": {
      "reasoning": "meta-llama/llama-3-1-70b-instruct",
      "execution": "ibm/granite-3-2b-instruct"
    }
  }
}
```

## Troubleshooting

### Config Not Loading
- Ensure `forge.config.json` is in workspace root
- Check JSON syntax (use a validator)
- Restart VS Code after config changes

### Invalid Configuration
- Check VS Code Output panel (Forge channel)
- Extension falls back to defaults on error
- Warning message shown in VS Code

### Port Already in Use
```json
{
  "server": { "port": 3001 }
}
```

## Best Practices

1. **Version Control:** Commit `forge.config.json` for team consistency
2. **Sensitive Data:** Keep API keys in `watson/.env`, not config
3. **Documentation:** Comment your config changes
4. **Testing:** Test config changes in development first
5. **Backup:** Keep a copy of working configurations

## Example Configurations

### Minimal Config (Use Defaults)
```json
{}
```

### Custom Port Only
```json
{
  "server": { "port": 8080 }
}
```

### Full Custom Config
```json
{
  "server": {
    "port": 3001,
    "host": "127.0.0.1"
  },
  "watsonx": {
    "baseUrl": "https://eu-de.ml.cloud.ibm.com",
    "models": {
      "reasoning": "meta-llama/llama-3-3-70b-instruct",
      "execution": "ibm/granite-3-8b-instruct"
    }
  },
  "budget": {
    "maxBobcoins": 60,
    "toolOverheadBuffer": 750,
    "costs": {
      "llama": 1.0,
      "granite": 0.1
    }
  },
  "workspace": {
    "requireWorkspaceFolder": true,
    "defaultScaffoldPath": "./generated"
  }
}
```

## Support

For issues or questions about configuration:
1. Check the Forge Output channel in VS Code
2. Verify JSON syntax
3. Review this documentation
4. Check for typos in option names