-- schema.lua
return {
    no_consumer = true,
    fields = {},
    self_check = function(schema, plugin_t, dao, is_update)
      return true
    end
}
  