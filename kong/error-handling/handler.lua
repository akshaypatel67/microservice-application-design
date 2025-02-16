-- handler.lua
local cjson = require "cjson"

function MyCustomPlugin:new()
  MyCustomPlugin.super.new(self, "error-handling")
end

function MyCustomPlugin:access(conf)
  MyCustomPlugin.super.access(self)

  -- Capture the response from the upstream service
  ngx.ctx.buffer = ""
  ngx.resp.add_body_reader(function(chunk)
    if chunk then
      ngx.ctx.buffer = ngx.ctx.buffer .. chunk
    end
  end)
end

function MyCustomPlugin:body_filter(conf)
  MyCustomPlugin.super.body_filter(self)

  local status = ngx.status

  if status >= 400 then
    local body = ngx.ctx.buffer

    -- If the response is gRPC, parse the error message
    if ngx.header["content-type"] == "application/grpc" then
      local message = cjson.decode(body).message
      ngx.status = status
      ngx.header.content_type = "application/json"
      ngx.say(cjson.encode({ error = message }))
      ngx.exit(status)
    end
  end
end

MyCustomPlugin.PRIORITY = 1000

return MyCustomPlugin
