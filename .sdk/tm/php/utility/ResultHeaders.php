<?php
declare(strict_types=1);

// Buggie SDK utility: result_headers

class BuggieResultHeaders
{
    public static function call(BuggieContext $ctx): ?BuggieResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
