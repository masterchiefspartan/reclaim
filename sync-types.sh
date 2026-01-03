#!/bin/bash

# Create destination directories if they don't exist
mkdir -p RecoverVoiceApp/src/types
mkdir -p functions/src/types

# Copy the file
cp shared/types.ts RecoverVoiceApp/src/types/shared.ts
cp shared/types.ts functions/src/types/shared.ts

echo "✅ Types synced to App and Functions"

