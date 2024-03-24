<form id="create-menu-item-form" method="POST" action="{{ route('menu.menu-items.store') }}">
    @csrf

    <div>
        <label for="type">Typ zakłądki:</label>
        <select class= id="type" name="type" required>
            <option value="main">Główna</option>
            <option value="sub">Podrzędna</option>
        </select>
    </div>

    <div>
        <label for="name">Nazwa zakłądki:</label>
        <input type="text" id="name" name="name" required>
    </div>

    <div>
        <label for="parent_id">Element poprzednika zakładki:</label>
        <select id="parent_id" name="parent_id">
            <option value="null">Brak rodzica</option>
            @foreach($menuItems_to_select as $item)
                <option value="{{ $item->id }}">{{ $item->name }}</option>
            @endforeach
        </select>
    </div>

    <div>
        <label for="owners">Opiekuny/Administratorzy:</label>
        <select id="owners" name="owners[]" multiple>
            @foreach(App\Models\User::all() as $user)
                <option value="{{ $user->id }}">{{ $user->name }}</option>
            @endforeach
        </select>
    </div>

    <div>
        <label for="visibility_start">Zakładka widoczna od:</label>
        <input type="date" id="visibility_start" name="visibility_start">
    </div>

    <div>
        <label for="visibility_end">Zakładka widoczna do:</label>
        <input type="date" id="visibility_end" name="visibility_end">
    </div>

    <div>
        <label for="banner">Przypisanie banera:</label>
        <select id="tab_banner" name="tab_banner">
            <option value="random_banner">Baner losowy</option>
            <option value="dedicated_banner">Baner dedykowany</option>
        </select>
    </div>

    <div class="form-actions">
        <button type="submit" class="btn btn-submit">Zapisz element menu</button>
        <button type="reset" class="btn btn-reset">Wyczyść formularz</button>
    </div>
</form>
