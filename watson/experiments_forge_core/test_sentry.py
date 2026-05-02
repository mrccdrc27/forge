import unittest
from sentry import ResourceSentry

class TestResourceSentry(unittest.TestCase):
    def test_initialization_default(self):
        sentry = ResourceSentry()
        self.assertEqual(sentry.budget_cents, 100)
        self.assertEqual(sentry.total_tokens, 0)
        self.assertEqual(sentry.total_cost_cents, 0)

    def test_initialization_custom(self):
        sentry = ResourceSentry(budget_cents=50)
        self.assertEqual(sentry.budget_cents, 50)

    def test_log_usage(self):
        sentry = ResourceSentry()
        # 1000 tokens should cost 0.0006 * 100 = 0.06 cents
        sentry.log_usage(500, 500)
        self.assertEqual(sentry.total_tokens, 1000)
        self.assertAlmostEqual(sentry.total_cost_cents, 0.06, places=4)

        # Another 2000 tokens (1.2 cents total)
        sentry.log_usage(1000, 1000)
        self.assertEqual(sentry.total_tokens, 3000)
        self.assertAlmostEqual(sentry.total_cost_cents, 0.18, places=4)

    def test_has_budget(self):
        # Set a small budget for testing: 0.1 cents
        sentry = ResourceSentry(budget_cents=0.1)
        
        # 1000 tokens costs 0.06 cents. Should have budget.
        self.assertTrue(sentry.has_budget(1000))
        
        # 2000 tokens costs 0.12 cents. Should NOT have budget.
        self.assertFalse(sentry.has_budget(2000))

        # Log 1000 tokens (0.06 cents used)
        sentry.log_usage(500, 500)
        
        # Now 1000 more tokens (0.06 + 0.06 = 0.12) should exceed budget
        self.assertFalse(sentry.has_budget(1000))
        
        # 500 more tokens (0.06 + 0.03 = 0.09) should be okay
        self.assertTrue(sentry.has_budget(500))

if __name__ == '__main__':
    unittest.main()
