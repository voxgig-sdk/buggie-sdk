<?php
declare(strict_types=1);

// Buggie SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class BuggieMakeContext
{
    public static function call(array $ctxmap, ?BuggieContext $basectx): BuggieContext
    {
        return new BuggieContext($ctxmap, $basectx);
    }
}
