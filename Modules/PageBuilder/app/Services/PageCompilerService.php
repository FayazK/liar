<?php

declare(strict_types=1);

namespace Modules\PageBuilder\Services;

use Modules\PageBuilder\Models\BuilderPage;

class PageCompilerService
{
    /**
     * Compile GrapesJS data into static HTML+CSS.
     *
     * GrapesJS stores the editor state as:
     * - grapes_data['html']: The HTML output from editor.getHtml()
     * - grapes_data['css'] or grapes_css: The CSS from editor.getCss()
     */
    public function compile(BuilderPage $builderPage): BuilderPage
    {
        $grapesData = $builderPage->grapes_data ?? [];
        $html = $grapesData['html'] ?? '';
        $css = $grapesData['css'] ?? $builderPage->grapes_css ?? '';

        $sanitizedHtml = self::sanitizeHtml($html);

        if (config('page-builder.compilation.minify_html', true)) {
            $sanitizedHtml = $this->minifyHtml($sanitizedHtml);
        }

        if (config('page-builder.compilation.minify_css', true)) {
            $css = $this->minifyCss($css);
        }

        $builderPage->update([
            'compiled_html' => $sanitizedHtml,
            'compiled_css' => $css,
            'compiled_at' => now(),
        ]);

        return $builderPage;
    }

    public static function sanitizeHtml(string $html): string
    {
        if (empty($html)) {
            return '';
        }

        $html = preg_replace('#<script\b[^>]*>.*?</script>#is', '', $html);
        $html = preg_replace('/\s+on\w+\s*=\s*["\'][^"\']*["\']/i', '', $html);
        $html = preg_replace('#<iframe\b[^>]*>.*?</iframe>#is', '', $html);
        $html = preg_replace('#<(object|embed)\b[^>]*>.*?</\1>#is', '', $html);

        return $html;
    }

    private function minifyHtml(string $html): string
    {
        if (empty($html)) {
            return '';
        }

        $html = preg_replace('/\s+/', ' ', $html);
        $html = preg_replace('/>\s+</', '><', $html);

        return trim($html);
    }

    private function minifyCss(string $css): string
    {
        if (empty($css)) {
            return '';
        }

        $css = preg_replace('/\/\*.*?\*\//s', '', $css);
        $css = preg_replace('/\s+/', ' ', $css);
        $css = preg_replace('/\s*([{}:;,])\s*/', '$1', $css);

        return trim($css);
    }
}
