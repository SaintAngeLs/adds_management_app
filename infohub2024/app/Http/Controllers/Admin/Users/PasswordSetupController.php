<?php

namespace App\Http\Controllers\Admin\Users;

use App\Contracts\IApplication;
use App\Contracts\IStatistics;
use App\Contracts\IUserPasswordSetup;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class PasswordSetupController extends Controller implements IUserPasswordSetup
{
    protected $applicationService;
    protected $statisticsService;

    public function __construct(IApplication $applicationService, IStatistics $statisticsService)
    {
        $this->applicationService = $applicationService;
        $this->statisticsService = $statisticsService;
    }
    public function showSetPasswordForm(Request $request, User $user)
    {
        return view('auth.set-password', compact('user'));
    }

    public function updatePassword(Request $request, User $user)
    {
        Log::debug('Setting the password', $request->all());
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($request->password),
            'active' => 1,
            'password_last_changed' => now(),
        ]);

        $this->statisticsService->logUserActivity(auth()->id(), [
            'uri' => $request->path(),
            'post_string' => $request->except('_token'),
            'query_string' => $request->getQueryString(),
        ]);

        return redirect()->route('login')->with('success', 'Your account is now active. You can log in with your new password.');
    }
}
