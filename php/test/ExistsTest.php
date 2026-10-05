<?php
declare(strict_types=1);

// Buggie SDK exists test

require_once __DIR__ . '/../buggie_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = BuggieSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
