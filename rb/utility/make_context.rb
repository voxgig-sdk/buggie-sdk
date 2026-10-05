# Buggie SDK utility: make_context
require_relative '../core/context'
module BuggieUtilities
  MakeContext = ->(ctxmap, basectx) {
    BuggieContext.new(ctxmap, basectx)
  }
end
