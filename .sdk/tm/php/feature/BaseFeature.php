<?php
declare(strict_types=1);

// Buggie SDK base feature

class BuggieBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(BuggieContext $ctx, array $options): void {}
    public function PostConstruct(BuggieContext $ctx): void {}
    public function PostConstructEntity(BuggieContext $ctx): void {}
    public function SetData(BuggieContext $ctx): void {}
    public function GetData(BuggieContext $ctx): void {}
    public function GetMatch(BuggieContext $ctx): void {}
    public function SetMatch(BuggieContext $ctx): void {}
    public function PrePoint(BuggieContext $ctx): void {}
    public function PreSpec(BuggieContext $ctx): void {}
    public function PreRequest(BuggieContext $ctx): void {}
    public function PreResponse(BuggieContext $ctx): void {}
    public function PreResult(BuggieContext $ctx): void {}
    public function PreDone(BuggieContext $ctx): void {}
    public function PreUnexpected(BuggieContext $ctx): void {}
}
