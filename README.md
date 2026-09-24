
# MCP LLM

## Let the AI orchestration begin!
- Simple MCP server lets your Agentic IDE/Workspace use other LLMs
- Through OpenAI API standard - so local and remote are supported

## Setting up
- Clone this repo with `git clone https://github.com/xxxmoney/mcp-llm`
- Copy `.env.example` to `.env` and fill in your base url, token and model
- Get [Docker](https://www.docker.com)
- Run `docker compose up -d` to start the MCP server
- Add MCP server setting to your Agentic IDE/Workspace config file
  - ```
    { 
      "mcpServers": { 
        "llm": { 
          "serverUrl": "http://localhost:666/mcp" 
        } 
        ...
      } 
    }
    ```

## Usage
- After [setting up](#setting-up), make sure Agentic IDE/Workspace can use the tool
- You can now test with your LLM something like
  - Firstly ask `Can you see "llm tool" you could use? What can it do?`
  - Then you can try with `Use the llm tool - generate a simple poem`

## Local development
- Uses @fastify and @modelcontextprotocol libraries to handle MCP HTTP Streaming
- Running with Docker:
  - `docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d`
- Running on your machine:
  - [Node](https://nodejs.org/en) installed
  - `npm install`
  - `npm run dev`
- Testing
  - `npx @modelcontextprotocol/inspector`
  - Click `Add Server` and enter `http://localhost:666/mcp`
  - You can now test the connection, and in the `Tools` tab test the tools
- Side note this cool lil' example for the HTTP Streaming:
  - [Link](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/examples/sse-polling/server.ts)

