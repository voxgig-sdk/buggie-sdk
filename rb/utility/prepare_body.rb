# Buggie SDK utility: prepare_body
require_relative 'media'
module BuggieUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return BuggieUtilities.raw_body(ctx.reqdata) if BuggieUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
