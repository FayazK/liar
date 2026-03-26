@if($brandProfile)
## Brand Context
- Business: {{ $brandProfile->business_name }}
@if($brandProfile->industry)- Industry: {{ $brandProfile->industry }}
@endif
- Voice: {{ $brandProfile->tone_of_voice }}
@if($brandProfile->target_audience)- Audience: {{ $brandProfile->target_audience }}
@endif
@if($brandProfile->color_palette)
- Colors: Primary {{ $brandProfile->color_palette['primary'] ?? '#333' }}, Secondary {{ $brandProfile->color_palette['secondary'] ?? '#666' }}, Accent {{ $brandProfile->color_palette['accent'] ?? '#e94560' }}
@endif
@if($brandProfile->brand_description)- Brand: {{ $brandProfile->brand_description }}
@endif
@endif
