#!/bin/bash
echo "🚀 Initializing Laravel seed..."

# Basic Laravel structure placeholder
mkdir -p app/Http/Controllers
mkdir -p routes
mkdir -p resources/views

echo "<?php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});" > routes/web.php

echo "Seed initialization complete."
