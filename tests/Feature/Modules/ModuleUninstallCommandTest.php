<?php

declare(strict_types=1);

describe('module:uninstall command', function () {
    it('fails when module does not exist', function () {
        $this->artisan('module:uninstall NonExistent')
            ->expectsOutput('Module "NonExistent" does not exist.')
            ->assertExitCode(1);
    });
});
