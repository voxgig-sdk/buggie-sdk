<?php
declare(strict_types=1);

// Buggie SDK utility: result_body

class BuggieResultBody
{
    public static function call(BuggieContext $ctx): ?BuggieResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
