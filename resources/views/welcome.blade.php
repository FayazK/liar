<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="A modern, professional Laravel application built with the latest technologies and best practices for rapid development.">

    <title>{{ config('app.name', 'Liar') }} - Modern Laravel Application</title>

    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

    {{-- Dark mode: prevent flash --}}
    <script>
        (function() {
            const stored = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (stored === 'dark' || (!stored && prefersDark)) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>

    {{-- x-cloak: hide Alpine elements until loaded --}}
    <style>[x-cloak] { display: none !important; }</style>

    @vite(['resources/css/front.css', 'resources/js/front.js'])
</head>
<body class="min-h-screen antialiased">
    {{-- Header --}}
    @include('front.partials.header')

    <main x-data="scrollReveal">
        {{-- Hero Section --}}
        <section class="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h1 class="animate-fade-in-up text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        Welcome to <span class="text-primary">{{ config('app.name', 'Liar') }}</span>
                    </h1>
                    <p class="animate-fade-in-up delay-200 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground opacity-0">
                        A modern, professional Laravel application built with the latest technologies and best practices for rapid development and deployment.
                    </p>
                    @guest
                        <div class="animate-fade-in-up delay-400 mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row">
                            <a
                                href="{{ route('register') }}"
                                class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
                            >
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                                Get Started
                            </a>
                            <a
                                href="{{ route('login') }}"
                                class="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-medium text-foreground transition-all hover:bg-secondary"
                            >
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                    <polyline points="10 17 15 12 10 7"></polyline>
                                    <line x1="15" y1="12" x2="3" y2="12"></line>
                                </svg>
                                Sign In
                            </a>
                        </div>
                    @endguest
                </div>
            </div>

            {{-- Decorative gradient --}}
            <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full overflow-hidden">
                <div class="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"></div>
            </div>
        </section>

        {{-- Features Section --}}
        <section id="features" class="py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal text-center">
                    <h2 class="text-3xl font-bold text-foreground sm:text-4xl">Why Choose {{ config('app.name', 'Liar') }}?</h2>
                    <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Built with the best tools and practices for modern web development.
                    </p>
                </div>

                <div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    @php
                        $features = [
                            ['icon' => 'rocket', 'title' => 'Fast Development', 'description' => 'Built with Laravel and React for rapid development and deployment.', 'color' => 'text-primary'],
                            ['icon' => 'shield', 'title' => 'Secure by Default', 'description' => 'Industry-standard security practices built into every component.', 'color' => 'text-emerald-500'],
                            ['icon' => 'bolt', 'title' => 'High Performance', 'description' => 'Optimized for speed with efficient rendering and caching strategies.', 'color' => 'text-amber-500'],
                            ['icon' => 'world', 'title' => 'Modern Stack', 'description' => 'Using the latest technologies: Laravel 12, React 19, Inertia.js.', 'color' => 'text-blue-500'],
                            ['icon' => 'paintbrush', 'title' => 'Beautiful UI', 'description' => 'Thoughtfully designed interface with MUJI-inspired aesthetics.', 'color' => 'text-pink-500'],
                            ['icon' => 'refresh', 'title' => 'Easy Maintenance', 'description' => 'Clean architecture makes updates and scaling a breeze.', 'color' => 'text-purple-500'],
                        ];
                    @endphp

                    @foreach($features as $index => $feature)
                        <div class="reveal rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30" style="transition-delay: {{ $index * 100 }}ms">
                            <div class="mb-4 inline-flex rounded-lg bg-secondary p-3 {{ $feature['color'] }}">
                                @switch($feature['icon'])
                                    @case('rocket')
                                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                                            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                                            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                                            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                                        </svg>
                                        @break
                                    @case('shield')
                                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            <path d="m9 12 2 2 4-4"></path>
                                        </svg>
                                        @break
                                    @case('bolt')
                                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                        </svg>
                                        @break
                                    @case('world')
                                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                        @break
                                    @case('paintbrush')
                                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"></path>
                                            <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"></path>
                                            <path d="M14.5 17.5 4.5 15"></path>
                                        </svg>
                                        @break
                                    @case('refresh')
                                        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                            <path d="M3 3v5h5"></path>
                                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                                            <path d="M16 16h5v5"></path>
                                        </svg>
                                        @break
                                @endswitch
                            </div>
                            <h3 class="text-lg font-semibold text-foreground">{{ $feature['title'] }}</h3>
                            <p class="mt-2 text-muted-foreground">{{ $feature['description'] }}</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- Testimonials Section --}}
        <section id="testimonials" class="bg-secondary/50 py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal text-center">
                    <h2 class="text-3xl font-bold text-foreground sm:text-4xl">Loved by Developers</h2>
                    <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        See what developers are saying about our platform.
                    </p>
                </div>

                <div class="mt-16 grid gap-8 md:grid-cols-3">
                    @php
                        $testimonials = [
                            ['name' => 'Sarah Chen', 'role' => 'Lead Developer', 'avatar' => 'S', 'content' => 'The architecture is clean and well-thought-out. It\'s exactly what I needed for my projects.'],
                            ['name' => 'Marcus Johnson', 'role' => 'Full Stack Engineer', 'avatar' => 'M', 'content' => 'Incredible developer experience. The MUJI-inspired design is beautiful and functional.'],
                            ['name' => 'Elena Rodriguez', 'role' => 'Tech Lead', 'avatar' => 'E', 'content' => 'Best Laravel starter kit I\'ve used. The attention to detail is impressive.'],
                        ];
                    @endphp

                    @foreach($testimonials as $index => $testimonial)
                        <div class="reveal rounded-xl border border-border bg-card p-6" style="transition-delay: {{ $index * 100 }}ms">
                            <div class="flex items-center gap-4">
                                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                                    {{ $testimonial['avatar'] }}
                                </div>
                                <div>
                                    <div class="font-semibold text-foreground">{{ $testimonial['name'] }}</div>
                                    <div class="text-sm text-muted-foreground">{{ $testimonial['role'] }}</div>
                                </div>
                            </div>
                            <p class="mt-4 text-muted-foreground">"{{ $testimonial['content'] }}"</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- Pricing Section --}}
        <section id="pricing" class="py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal text-center">
                    <h2 class="text-3xl font-bold text-foreground sm:text-4xl">Simple, Transparent Pricing</h2>
                    <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Choose the plan that works for you.
                    </p>
                </div>

                <div class="mt-16 grid gap-8 md:grid-cols-3">
                    @php
                        $plans = [
                            ['name' => 'Free', 'price' => '$0', 'period' => 'forever', 'features' => ['Basic features', 'Community support', '1 project'], 'cta' => 'Get Started', 'popular' => false],
                            ['name' => 'Pro', 'price' => '$29', 'period' => '/month', 'features' => ['All features', 'Priority support', 'Unlimited projects', 'Advanced analytics'], 'cta' => 'Start Free Trial', 'popular' => true],
                            ['name' => 'Enterprise', 'price' => 'Custom', 'period' => '', 'features' => ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee'], 'cta' => 'Contact Sales', 'popular' => false],
                        ];
                    @endphp

                    @foreach($plans as $index => $plan)
                        <div class="reveal relative rounded-xl border {{ $plan['popular'] ? 'border-primary' : 'border-border' }} bg-card p-8" style="transition-delay: {{ $index * 100 }}ms">
                            @if($plan['popular'])
                                <div class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                                    Most Popular
                                </div>
                            @endif
                            <div class="text-center">
                                <h3 class="text-lg font-semibold text-foreground">{{ $plan['name'] }}</h3>
                                <div class="mt-4">
                                    <span class="text-4xl font-bold text-foreground">{{ $plan['price'] }}</span>
                                    <span class="text-muted-foreground">{{ $plan['period'] }}</span>
                                </div>
                            </div>
                            <ul class="mt-8 space-y-4">
                                @foreach($plan['features'] as $feature)
                                    <li class="flex items-center gap-3 text-muted-foreground">
                                        <svg class="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        {{ $feature }}
                                    </li>
                                @endforeach
                            </ul>
                            <a
                                href="{{ route('register') }}"
                                class="mt-8 block w-full rounded-lg {{ $plan['popular'] ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border bg-card text-foreground hover:bg-secondary' }} px-4 py-3 text-center font-medium transition-colors"
                            >
                                {{ $plan['cta'] }}
                            </a>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- Tech Stack Section --}}
        <section class="bg-secondary/50 py-20 lg:py-32">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="reveal text-center">
                    <h2 class="text-3xl font-bold text-foreground sm:text-4xl">Built with Modern Tech</h2>
                    <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Powered by industry-leading technologies.
                    </p>
                </div>

                <div class="reveal mt-12 flex flex-wrap items-center justify-center gap-4">
                    @php
                        $technologies = [
                            ['name' => 'Laravel 12', 'type' => 'Backend'],
                            ['name' => 'React 19', 'type' => 'Frontend'],
                            ['name' => 'Inertia.js', 'type' => 'Full-stack'],
                            ['name' => 'Ant Design', 'type' => 'UI Library'],
                            ['name' => 'TypeScript', 'type' => 'Language'],
                            ['name' => 'Tailwind CSS', 'type' => 'Styling'],
                            ['name' => 'Alpine.js', 'type' => 'JS Framework'],
                        ];
                    @endphp

                    @foreach($technologies as $tech)
                        <div class="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
                            <span class="font-medium text-foreground">{{ $tech['name'] }}</span>
                            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{{ $tech['type'] }}</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- FAQ Section --}}
        <section id="faq" class="py-20 lg:py-32">
            <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div class="reveal text-center">
                    <h2 class="text-3xl font-bold text-foreground sm:text-4xl">Frequently Asked Questions</h2>
                    <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Got questions? We've got answers.
                    </p>
                </div>

                <div x-data="accordion" class="reveal mt-12 space-y-4">
                    @php
                        $faqs = [
                            ['question' => 'What is Liar?', 'answer' => 'Liar is a modern Laravel application starter kit that combines the best tools and practices for rapid web development. It includes React 19, Inertia.js, Ant Design, and more.'],
                            ['question' => 'Is it free to use?', 'answer' => 'Yes! The core platform is free to use. We also offer Pro and Enterprise plans with additional features for teams and businesses.'],
                            ['question' => 'Can I use it for commercial projects?', 'answer' => 'Absolutely! You can use Liar for any project, personal or commercial. There are no restrictions on how you use it.'],
                            ['question' => 'How do I get support?', 'answer' => 'Free users have access to community support through our GitHub discussions. Pro and Enterprise users get priority support with faster response times.'],
                        ];
                    @endphp

                    @foreach($faqs as $index => $faq)
                        <div class="rounded-xl border border-border bg-card">
                            <button
                                @click="toggle({{ $index }})"
                                class="flex w-full items-center justify-between px-6 py-4 text-left"
                            >
                                <span class="font-semibold text-foreground">{{ $faq['question'] }}</span>
                                <svg
                                    class="h-5 w-5 text-muted-foreground transition-transform"
                                    :class="isOpen({{ $index }}) && 'rotate-180'"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            <div
                                x-show="isOpen({{ $index }})"
                                x-transition:enter="transition ease-out duration-200"
                                x-transition:enter-start="opacity-0 -translate-y-2"
                                x-transition:enter-end="opacity-100 translate-y-0"
                                x-transition:leave="transition ease-in duration-150"
                                x-transition:leave-start="opacity-100 translate-y-0"
                                x-transition:leave-end="opacity-0 -translate-y-2"
                                x-cloak
                                class="border-t border-border px-6 py-4"
                            >
                                <p class="text-muted-foreground">{{ $faq['answer'] }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- CTA Section --}}
        <section class="bg-primary py-20 lg:py-32">
            <div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-primary-foreground sm:text-4xl">Ready to Get Started?</h2>
                <p class="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                    Join thousands of developers building amazing applications with {{ config('app.name', 'Liar') }}.
                </p>
                @guest
                    <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            href="{{ route('register') }}"
                            class="inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 text-base font-medium text-primary transition-all hover:bg-primary-foreground/90"
                        >
                            Create Free Account
                        </a>
                        <a
                            href="{{ route('login') }}"
                            class="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-base font-medium text-primary-foreground transition-all hover:bg-primary-foreground/10"
                        >
                            Sign In
                        </a>
                    </div>
                @endguest
            </div>
        </section>
    </main>

    {{-- Footer --}}
    @include('front.partials.footer')
</body>
</html>
