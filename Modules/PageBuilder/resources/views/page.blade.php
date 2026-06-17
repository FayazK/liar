<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ $post->meta_title ?? $post->title }}</title>

    @if($post->meta_description)
        <meta name="description" content="{{ $post->meta_description }}">
    @endif

    <meta property="og:title" content="{{ $post->meta_title ?? $post->title }}">
    @if($post->meta_description)
        <meta property="og:description" content="{{ $post->meta_description }}">
    @endif

    @if($builderPage->compiled_css)
        <style>{!! $builderPage->compiled_css !!}</style>
    @endif
</head>
<body>
    {!! $builderPage->compiled_html !!}
</body>
</html>
