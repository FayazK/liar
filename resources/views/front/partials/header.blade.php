<header
    x-data="navbar"
    :class="scrolled ? 'border-b border-border bg-background/95 backdrop-blur-sm' : 'bg-transparent'"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
            {{-- Logo --}}
            <a href="{{ route('home') }}" class="flex items-center gap-3">
                <svg class="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <span class="text-xl font-semibold text-foreground">{{ config('app.name', 'Liar') }}</span>
            </a>

            {{-- Desktop Navigation --}}
            <nav class="hidden items-center gap-8 md:flex">
                <a href="#features" class="text-muted-foreground transition-colors hover:text-foreground">Features</a>
                <a href="#testimonials" class="text-muted-foreground transition-colors hover:text-foreground">Testimonials</a>
                <a href="#pricing" class="text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
                <a href="#faq" class="text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
            </nav>

            {{-- Desktop Actions --}}
            <div class="hidden items-center gap-4 md:flex">
                {{-- Dark Mode Toggle --}}
                <button
                    x-data="darkMode"
                    @click="toggle()"
                    class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label="Toggle dark mode"
                >
                    <svg x-show="!isDark" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <svg x-show="isDark" x-cloak class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </button>

                @auth
                    <a
                        href="{{ route('dashboard') }}"
                        class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Dashboard
                    </a>
                @else
                    <a
                        href="{{ route('login') }}"
                        class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Log in
                    </a>
                    <a
                        href="{{ route('register') }}"
                        class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        Register
                    </a>
                @endauth
            </div>

            {{-- Mobile Menu Button --}}
            <button
                @click="toggleMobileMenu()"
                class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary md:hidden"
                aria-label="Toggle menu"
            >
                <svg x-show="!mobileMenuOpen" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <svg x-show="mobileMenuOpen" x-cloak class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    </div>

    {{-- Mobile Menu --}}
    <div
        x-show="mobileMenuOpen"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 -translate-y-2"
        x-transition:enter-end="opacity-100 translate-y-0"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 translate-y-0"
        x-transition:leave-end="opacity-0 -translate-y-2"
        x-cloak
        class="border-b border-border bg-background md:hidden"
    >
        <nav class="flex flex-col gap-4 px-4 py-6">
            <a href="#features" @click="closeMobileMenu()" class="text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#testimonials" @click="closeMobileMenu()" class="text-muted-foreground transition-colors hover:text-foreground">Testimonials</a>
            <a href="#pricing" @click="closeMobileMenu()" class="text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
            <a href="#faq" @click="closeMobileMenu()" class="text-muted-foreground transition-colors hover:text-foreground">FAQ</a>

            <div class="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                {{-- Mobile Dark Mode Toggle --}}
                <button
                    x-data="darkMode"
                    @click="toggle()"
                    class="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <svg x-show="!isDark" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <svg x-show="isDark" x-cloak class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <span x-text="isDark ? 'Light Mode' : 'Dark Mode'"></span>
                </button>

                @auth
                    <a
                        href="{{ route('dashboard') }}"
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Dashboard
                    </a>
                @else
                    <a
                        href="{{ route('login') }}"
                        class="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                        Log in
                    </a>
                    <a
                        href="{{ route('register') }}"
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Register
                    </a>
                @endauth
            </div>
        </nav>
    </div>
</header>
