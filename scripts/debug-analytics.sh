#!/bin/bash

# Analytics Debug Script
# This script checks if all screen components have proper analytics tracking setup

echo "🔍 Analytics Tracking Debug Tool"
echo "================================="
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Run the debug script
node scripts/debug-analytics.js

exit_code=$?

echo ""
if [ $exit_code -eq 0 ]; then
    echo "✅ Analytics tracking is properly configured!"
else
    echo "❌ Analytics tracking needs attention. Please review the issues above."
fi

exit $exit_code