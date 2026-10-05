# Buggie SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

BuggieUtility.registrar = ->(u) {
  u.clean = BuggieUtilities::Clean
  u.clean_add = BuggieUtilities::CleanAdd
  u.clean_explain = BuggieUtilities::CleanExplain
  u.done = BuggieUtilities::Done
  u.make_error = BuggieUtilities::MakeError
  u.feature_add = BuggieUtilities::FeatureAdd
  u.feature_hook = BuggieUtilities::FeatureHook
  u.feature_init = BuggieUtilities::FeatureInit
  u.fetcher = BuggieUtilities::Fetcher
  u.make_fetch_def = BuggieUtilities::MakeFetchDef
  u.make_context = BuggieUtilities::MakeContext
  u.make_options = BuggieUtilities::MakeOptions
  u.make_request = BuggieUtilities::MakeRequest
  u.make_response = BuggieUtilities::MakeResponse
  u.make_result = BuggieUtilities::MakeResult
  u.make_point = BuggieUtilities::MakePoint
  u.make_spec = BuggieUtilities::MakeSpec
  u.make_url = BuggieUtilities::MakeUrl
  u.param = BuggieUtilities::Param
  u.prepare_auth = BuggieUtilities::PrepareAuth
  u.prepare_body = BuggieUtilities::PrepareBody
  u.prepare_headers = BuggieUtilities::PrepareHeaders
  u.prepare_method = BuggieUtilities::PrepareMethod
  u.prepare_params = BuggieUtilities::PrepareParams
  u.prepare_path = BuggieUtilities::PreparePath
  u.prepare_query = BuggieUtilities::PrepareQuery
  u.graphql_body = BuggieUtilities::GraphqlBody
  u.graphql_errors = BuggieUtilities::GraphqlErrors
  u.result_basic = BuggieUtilities::ResultBasic
  u.result_body = BuggieUtilities::ResultBody
  u.result_headers = BuggieUtilities::ResultHeaders
  u.transform_request = BuggieUtilities::TransformRequest
  u.transform_response = BuggieUtilities::TransformResponse
}
