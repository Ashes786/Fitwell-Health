#!/bin/bash

echo "🔧 Final comprehensive TypeScript fixes..."

# Fix 1: Complete all incomplete toast calls with missing closing braces
echo "1. Fixing incomplete toast calls..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/description: \([^)]*\)[)]$/description: \1\n      })/g'

# Fix 2: Fix remaining session destructuring conflicts
echo "2. Fixing session destructuring conflicts..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/session: session/authSession: authSession/g'

# Fix 3: Fix useRoleAuthorization import issues
echo "3. Ensuring useRoleAuthorization imports..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs grep -l "useRoleAuthorization(" | while read file; do
  if ! grep -q "import.*useRoleAuthorization" "$file"; then
    sed -i '/^import.*{.*useSession.*}/a\import { useRoleAuthorization } from "@/hooks/use-role-authorization"' "$file"
  fi
done

echo "✅ Final fixes completed!"
echo "🔄 Running build to check remaining issues..."