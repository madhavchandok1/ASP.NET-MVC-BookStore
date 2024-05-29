using BookStore.DataAccessLayer.Data;
using BookStore.DataAccessLayer.Repository.IRepository;
using BookStore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.Language.Intermediate;

namespace BookStore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class CategoryController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        public CategoryController(IUnitOfWork db)
        {
            _unitOfWork = db;
        }

        //Route for Index
        [HttpGet]
        public IActionResult Index()
        {

            List<Category> objCategoryList = _unitOfWork.Category.GetAll().ToList();
            return View(objCategoryList);
        }

        //Route to create category in database
        [HttpGet]
        public IActionResult Upsert(int? categoryId)
        {
            Category category = new Category();
            
            if(categoryId!=null && categoryId != 0)
            {
                category = _unitOfWork.Category.Get(row => row.CategoryId == categoryId);
            }
            return View(category);
        }

        //Route to insert the category into the database
        [HttpPost]
        public IActionResult Upsert(Category category)
        {
            //Validation
            if (category.Name == category.DisplayOrder.ToString())
            {
                ModelState.AddModelError("name", "The Category Name cannot be same as that of the Display Order.");
            }
            

            if (ModelState.IsValid)
            {
                if (category.CategoryId == 0)
                {
                    _unitOfWork.Category.Add(category);
                    TempData["success"] = "Category created successfully";
                }
                else
                {
                    _unitOfWork.Category.Update(category);
                    TempData["success"] = "Category updated successfully";
                }
                _unitOfWork.Save();
                return RedirectToAction("Index", "Category");
            }
            return View();
        }

        #region APICALLS
        [HttpGet]
        public IActionResult GetAll()
        {
            List<Category> objCategoryList = _unitOfWork.Category.GetAll().ToList();
            return Json(new { data = objCategoryList });
        }

        [HttpDelete]
        public IActionResult Delete(int? id)
        {
            var categoryToDelete = _unitOfWork.Category.Get(row => row.CategoryId == id);
            if(categoryToDelete == null)
            {
                return Json(new { success = false, message = "Error while deleting the product" });
            }

            _unitOfWork.Category.Remove(categoryToDelete);
            _unitOfWork.Save();

            return Json(new { success = true, message = "Category deleted successfully" });
        }
        #endregion
    }
}
