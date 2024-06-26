<?php

namespace App\Http\Controllers\Admin\Permissions;

use App\Http\Controllers\Controller;
use App\Models\MenuItems\MenuItem;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\UsersGroup;
use Illuminate\Support\Facades\Log;

class PermissionViewController extends Controller
{
    public function index()
    {
        return view('admin.users.permissions');
    }


    public function editUserPermissions($userId = null)
    {
        $user = null;
        $isEdit = false;
        $targetUserId = null;

        if ($userId !== null) {
            $user = User::find($userId);
            $isEdit = true;
            $targetUserId = $userId;
        }
        return view('admin.users.edit-permissions', compact('user', 'isEdit', 'targetUserId'));
    }


    public function editGroupPermissions($groupId = null)
    {
        $group = null;
        $isEdit = false;

        if ($groupId !== null) {
            $group = UsersGroup::where('id', $groupId)->with('permissions')->first();
            $isEdit = true;

            if (!$group) {
                return redirect()->route('admin.groups.index')->with('error', 'Group not found.');
            }
        }

        $menuItems = MenuItem::getOrderedMenuItems();
        $permissions = $group ? $group->permissions->pluck('menu_item_id')->toArray() : [];
        $formattedMenuItems = $this->formatMenuItemsForPermissionsTable($menuItems, $permissions);

        return view('admin.groups.edit-permissions', compact('group', 'isEdit', 'formattedMenuItems', 'groupId'));
    }


    protected function formatMenuItemsForPermissionsTable($menuItems, $permissions)
    {
        $formatted = [];
        foreach ($menuItems as $item) {
            $checked = in_array($item->id, $permissions) ? "checked" : "";
            $formatted[] = [
                'id' => $item->id,
                'name' => $item->name,
                'checked' => $checked,
                'children' => $item->children->isEmpty() ? [] : $this->formatMenuItemsForPermissionsTable($item->children, $permissions),
            ];
        }
        return $formatted;
    }

    public function copyFromUser($targetUserId)
    {
        // Log and fetch users as before
        Log::info("Accessing copy permissions page for target user ID: $targetUserId");
        $users = User::all(); // Assuming you're fetching all users to display in your view
        return view('admin.users.copy-from-user', compact('users', 'targetUserId'));
    }

    public function copyFromGroup()
    {
        $groups = UsersGroup::all();
        return view('admin.users.copy-from-group', compact('groups'));
    }


}
