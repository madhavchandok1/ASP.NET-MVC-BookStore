var categoryDataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    categoryDataTable = $('#categoryTblData').DataTable({
        "ajax": { url: "/admin/category/GetAll" },
        "columns": [
            { data: 'name', "width": "30%" },
            { data: 'displayOrder', "width": "30%" },
            {
                data: 'categoryId',
                "render": function (data) {
                    return `<div class="w-70 btn-group" role="group">
                                 <a href="/admin/category/upsert?categoryId=${data}" class="btn btn-primary mx-1"> <i class="bi bi-pencil-square"></i> Edit</a>               
                                 <a onClick=Delete('/admin/category/delete/${data}') class="btn btn-danger mx-1"> <i class="bi bi-trash-fill"></i> Delete</a>
                            </div>`
                },
                "width": "40%"
            }
        ]
    });
}

function Delete(url) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (data) {
                    categoryDataTable.ajax.reload();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success",
                    });
                    toastr.success(data.message);
                }
            })
        }
    })
}