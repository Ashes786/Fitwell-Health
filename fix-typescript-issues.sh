#!/bin/bash

echo "🔧 Fixing TypeScript issues in Fitwell-Health project..."

# Fix 1: Add missing useRoleAuthorization imports
echo "1. Fixing useRoleAuthorization imports..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs grep -l "useRoleAuthorization(" | while read file; do
  if ! grep -q "import.*useRoleAuthorization" "$file"; then
    echo "   Adding import to $file"
    sed -i '1i\import { useRoleAuthorization } from "@/hooks/use-role-authorization"' "$file"
  fi
done

# Fix 2: Fix authSession destructuring issue (should be session, not authSession)
echo "2. Fixing authSession destructuring..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/authSession:/session:/g'

# Fix 3: Fix toast method calls (error, success, info don't exist on custom toast)
echo "3. Fixing toast method calls..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/toast\.error(/toast({\n        title: "Error",\n        description: /g'
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/toast\.success(/toast({\n        title: "Success",\n        description: /g'
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/toast\.info(/toast({\n        title: "Info",\n        description: /g'

# Fix 4: Fix session destructuring in layouts
echo "4. Fixing session destructuring in layouts..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/{ data: session, status }/const { data: session, status } = useSession()/g'

# Fix 5: Fix nodemailer createTransporter -> createTransport
echo "5. Fixing nodemailer import..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/createTransporter/createTransport/g'

echo "✅ TypeScript fixes completed!"
echo "🔄 Running build to check remaining issues..."