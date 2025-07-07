<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Closure;

class CacheService
{
    /**
     * Cache any value with a custom key and optional tags.
     *
     * @param string $key
     * @param \Closure $callback
     * @param int $ttl
     * @param array $tags
     * @return mixed
     */
    public function remember(string $key, Closure $callback, int $ttl = 600, array $tags = [])
    {
        if (!empty($tags) && method_exists(Cache::getStore(), 'tags')) {
            return Cache::tags($tags)->remember($key, $ttl, $callback);
        }
        return Cache::remember($key, $ttl, $callback);
    }

    /**
     * Forget a cached value by key and optional tags.
     *
     * @param string $key
     * @param array $tags
     * @return void
     */
    public function forget(string $key, array $tags = [])
    {
        if (!empty($tags) && method_exists(Cache::getStore(), 'tags')) {
            Cache::tags($tags)->forget($key);
        } else {
            Cache::forget($key);
        }
    }

    /**
     * Flush all cache for the given tags.
     *
     * @param array $tags
     * @return void
     */
    public function flushTags(array $tags)
    {
        if (!empty($tags) && method_exists(Cache::getStore(), 'tags')) {
            Cache::tags($tags)->flush();
        }
    }
}
