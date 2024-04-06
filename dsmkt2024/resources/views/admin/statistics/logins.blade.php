{{-- resources/views/admin/statistics/logins.blade.php --}}
@extends('layouts.app')

@section('content')
<div class="container mx-auto">
    <p class="content-tab-name">{{ __('Statystyki / Logowania') }}</p>
    @include('admin.statistics.partials.statistics-menu')
    <div class="mt-4">
        <a href="{{ route('menu.statistics.download-excel', ['type' => 'logins']) }}"" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
            Pobierz .XLS
        </a>
    </div>
    <h1 class="text-xl font-bold mb-4">Statystyki logowań</h1>
    <div>
        @include('admin.statistics.partials.filter-form')
    </div>
    <div class="mt-4">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @foreach ($logins as $login)
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">{{ $login->fingerprint }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ $login->ip }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ $login->user->name ?? 'N/A' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection