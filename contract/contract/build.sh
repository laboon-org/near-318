#!/bin/sh

echo ">> Building contract"

# near-sdk-js build src/contract.ts build/hello_near.wasm
near-sdk-js build src/contract.ts build/contract_bingo.wasm
