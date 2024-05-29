var productDataTable;

$(document).ready(function () {
    loadProductDataTable();
});

function loadProductDataTable() {
    productDataTable = $('#productTblData').DataTable({
        "ajax": { url: "/admin/products/getall" },
        "columns": [
            { data: 'title', "width": "25%" },
            { data: 'isbn', "width": "15%" },
            { data: 'listPrice', "width": "10%" },
            { data: 'author', "width": "15%" },
            { data: 'category.name', "width": "10%" },
            {
                data: 'productId',
                "render": function (data) {
                    return `<div class="w-70 btn-group" role="group">
                                 <a href="/admin/products/upsert?productId=${data}" class="btn btn-primary mx-1"> <i class="bi bi-pencil-square"></i> Edit</a>               
                                 <a onClick=Delete('/admin/products/delete/${data}') class="btn btn-danger mx-1"> <i class="bi bi-trash-fill"></i> Delete</a>
                            </div>`
                },
                "width": "25%"
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
                    productDataTable.ajax.reload();
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