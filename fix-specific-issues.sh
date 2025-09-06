#!/bin/bash

echo "🔧 Fixing specific TypeScript issues..."

# Fix 1: Remove duplicate const declarations and broken useSession lines
echo "1. Fixing broken useSession declarations..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/const const { data: session, status } = useSession() = useSession()/const { data: session, status } = useSession()/g'

# Fix 2: Fix authSession to session in useRoleAuthorization destructuring
echo "2. Fixing authSession to session..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/authSession/session/g'

# Fix 3: Fix incomplete toast calls (add missing closing braces and quotes)
echo "3. Fixing incomplete toast calls..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/toast({\n        title: "Error",\n        description: \(.*\))/toast({\n        title: "Error",\n        description: \1\n      })/g'
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/toast({\n        title: "Success",\n        description: \(.*\))/toast({\n        title: "Success",\n        description: \1\n      })/g'

# Fix 4: Fix nodemailer createTransporter to createTransport
echo "4. Fixing nodemailer method..."
find /home/z/my-project/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/createTransporter/createTransport/g'

echo "✅ Specific fixes completed!"