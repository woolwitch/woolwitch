#!/bin/bash

# Devcontainer setup script for Wool Witch project
# Installs Taskfile and Supabase CLI

set -e

echo "🧶 Setting up Wool Witch development environment..."

# Create .local/bin directory if it doesn't exist
mkdir -p "$HOME/.local/bin"

# Install Task (Taskfile runner) to user bin
echo "📋 Installing Task runner..."
curl -sL https://taskfile.dev/install.sh | sh -s -- -d -b "$HOME/.local/bin"

# Install Supabase CLI to user local bin
echo "🗄️ Installing Supabase CLI..."
curl -L "https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz" -o /tmp/supabase.tar.gz
tar -xzf /tmp/supabase.tar.gz -C /tmp
cp /tmp/supabase "$HOME/.local/bin/"
rm -f /tmp/supabase.tar.gz /tmp/supabase

# Make supabase executable
chmod +x "$HOME/.local/bin/supabase"

# Add to PATH for current session
export PATH=$PATH:$HOME/.local/bin

# Add to shell profile for future sessions
touch "$HOME/.bashrc"
if ! grep -q 'export PATH=$PATH:$HOME/.local/bin' "$HOME/.bashrc"; then
    echo 'export PATH=$PATH:$HOME/.local/bin' >> "$HOME/.bashrc"
fi

# Also add to .profile for better compatibility
touch "$HOME/.profile"
if ! grep -q 'export PATH=$PATH:$HOME/.local/bin' "$HOME/.profile"; then
    echo 'export PATH=$PATH:$HOME/.local/bin' >> "$HOME/.profile"
fi

# Source the updated bashrc
source "$HOME/.bashrc" || true

# Verify installations
echo "✅ Verifying installations..."

if command -v task &> /dev/null; then
    echo "Task $(task --version) installed successfully"
else
    echo "❌ Task installation failed"
    exit 1
fi

if command -v supabase &> /dev/null; then
    echo "Supabase CLI $(supabase --version) installed successfully"
else
    echo "❌ Supabase CLI installation failed"
    exit 1
fi

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

echo "🎉 Devcontainer setup complete!"
echo ""
echo "Next steps:"
echo "  • Run 'task setup' to initialize the project"
echo "  • Run 'task dev' to start development"
echo ""
echo "Port forwarding:"
echo "  • App: http://localhost:5173"
echo "  • Supabase API: http://localhost:54321"
echo "  • Supabase Studio: http://localhost:54323"