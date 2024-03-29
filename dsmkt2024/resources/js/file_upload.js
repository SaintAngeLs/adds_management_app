$(document).ready(function() {
    var dropzoneOptions = {
        url: "/menu/files/store",
        method: "post",
        paramName: "file",
        maxFilesize: 700, // MB
        dictDefaultMessage: "Przysuń tu pliki",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        init: function() {
            var myDropzone = this;

            if (existingFileUrl && existingFileName) {
                var mockFile = { name: existingFileName, size: 12345, accepted: true };
                myDropzone.files.push(mockFile);
                myDropzone.emit("addedfile", mockFile);
                myDropzone.emit("thumbnail", mockFile, existingFileUrl);
                myDropzone.emit("complete", mockFile);
                myDropzone._updateMaxFilesReachedClass();
            }

            this.on("addedfile", function(file) {
                if (this.files.length > 1 && this.files[0].name === existingFileName) {
                    this.removeFile(this.files[0]);
                }
            });

            this.on("success", function(file, response) {
                console.log(response);
            });
            this.on("error", function(file, response) {
                console.error(response);
            });
            this.on("sending", function(file, xhr, formData) {
                formData.append("menu_id", $("#menu_id").val());
                formData.append("name", $("#file_name").val());
                formData.append("visible_from", $("#visible_from").val());
                formData.append("visible_to", $("#visible_to").val());
                formData.append("key_words", $("#key_words").val());
                formData.append("auto_id", $("#auto_id").val());
                formData.append("file_source", $("#file_source").val());

                if ($("#file_source").val() === "file_external") {
                    formData.append("file_url", $("#input_file_external input").val());
                }

                if ($("#file_source").val() === "file_server") {
                    formData.append("server_file", $("#input_server_file input").val());
                }
            });
        }
    };

    var myDropzone = new Dropzone("#dropzoneFileUpload", dropzoneOptions);


    var modal = document.getElementById('serverFilesModal');

    $('#browseServerFilesButton').click(function() {
        $.ajax({
            url: '/menu/files/directory-structure',
            type: 'GET',
            success: function(response) {
                var list = $('#serverFileList');
                list.empty();

                console.log(response); // For debugging

                // Assuming the structure is correct and using 'ftp_upload' as the key
                if (response['ftp_upload'] && response['ftp_upload'].length > 0) {
                    response['ftp_upload'].forEach(function(file) {
                        var fileLink = $('<a href="#">').text(file.name).click(function(e) {
                            e.preventDefault();
                            populateFileField(file.id, file.name);
                        });
                        var listItem = $('<li>').append(fileLink);
                        list.append(listItem);
                    });
                } else {
                    list.append($('<li>').text("No files available"));
                }

                $('#serverFilesModal').show();
            },
            error: function(error) {
                console.error("Error fetching directory structure: ", error);
                alert('Could not fetch directory structure. Please try again later.');
            }
        });
    });


    function populateFileField(fileId, fileName) {
        $('#server_file_input').val(fileId);
        $('#selectedFileName').val(fileName);
        $('#serverFilesModal').hide();
    }


    var closeButton = document.getElementsByClassName("close-button")[0];
    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function toggleFileSource(source) {
        $('#input_file_pc').hide();
        $('#input_file_external').hide();
        $('#input_server_file').hide();


        if (source === 'file_pc') {
            $('#input_file_pc').show();
        } else if (source === 'file_external') {
            $('#input_file_external').show();
        } else if (source === 'file_server') {
            $('#input_server_file').show();
        }
    }

    $('#file_source').change(function() {
        toggleFileSource($(this).val());
    });

    toggleFileSource($('#file_source').val());



    $('form').on('submit', function(e) {
        e.preventDefault();

        var formData = new FormData(this);
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }
        var formAction = $(this).attr('action');
        var formMethod = $(this).attr('method');

        if (myDropzone.getQueuedFiles().length > 0) {
            myDropzone.on("queuecomplete", function() {
                submitFormData(formData, formAction, formMethod);
            });
            myDropzone.processQueue();
        } else {
            submitFormData(formData, formAction, formMethod);
        }
    });

    function submitFormData(formData, url, method) {
        $.ajax({
            url: url,
            type: method,
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Success:', response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error:', textStatus, errorThrown);
            }
        });
    }
});
