// window.updateUserPermission =  function updateUserPermission(checkboxElement, menuItemId, userId) {
//     const isChecked = checkboxElement.checked;
//     const action = isChecked ? 'assign' : 'remove';

//     $.ajax({
//         url: '/menu/permissions/update-user-permission',
//         method: 'POST',
//         data: {
//             menu_id: menuItemId,
//             user_id: userId,
//             action: action,
//             _token: $('meta[name="csrf-token"]').attr('content')
//         },
//         success: function(response) {
//             alert('Permissions updated successfully.');
//         },
//         error: function(xhr, status, error) {
//             console.error('Error updating permissions:', error);
//             // Optionally, revert the checkbox state if the update fails
//             checkboxElement.checked = !isChecked;
//         }
//     });
// }


$(document).ready(function() {
    var userId = $('#user-id').val();
    console.log(userId);

    $('#menu-tree-permissions-user').jstree({
        'core': {
           'data': {
                'url': function(node) {
                    return '/menu/users/get-menu-items-user-permissions?user_id=' + userId;
                },
                'data': function(node) {
                    return { 'id': node.id };
                }
            },
            "check_callback": true,
        },
        "plugins": ["dnd", "contextmenu", "wholerow", "html_data"]
    }).on('ready.jstree', function (e, data) {
        updateNodePadding(data.instance);
        data.instance.open_all();
    }).on('ready.jstree', function (e, data) {
        updateNodePadding(data.instance);
    }).on('open_node.jstree', function (e, data) {
        updateNodePadding(data.instance, data.node.id);
    });

    $(document).on('change', '#menu-tree-permissions-user .menu-item-checkbox', function() {
        var menuId = $(this).val();
        var userId = $('#user-id').val();
        console.log(userId);
        var isChecked = $(this).is(':checked');

        var action = isChecked ? 'assign' : 'remove';

        $.ajax({
            url: '/menu/permissions/update-user-permission',
            method: 'POST',
            data: {
                menu_id: menuId,
                user_id: userId,
                action: action,
                _token: $('meta[name="csrf-token"]').attr('content')
            },
            success: function(response) {
                alert('Permissions updated successfully.');
            },
            error: function(xhr, status, error) {
                console.error('Error updating permissions:', error);
            }
        });
    });


    function updateNodePadding(instance, nodeId) {
        var selector = nodeId ? '#' + nodeId + ' > .jstree-children' : '#menu-tree .jstree-node';
        $(selector).each(function() {
            var depth = instance.get_node($(this).closest('.jstree-node')).parents.length;
            var paddingLeft = 5 + depth * 3;
            $(this).css('padding-left', paddingLeft + 'px');
        });
    }
});

$(document).on('click', '.node-name', function(e) {
    e.stopPropagation();
    var nodeId = $(this).closest('.jstree-node').attr('id');
    window.location.href = '/menu/edit/' + nodeId;
});
