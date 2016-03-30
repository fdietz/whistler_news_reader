import { push } from "react-router-redux";

import { categoryFormUpdate } from "../modules/categoryForm";
import { requestCreateCategory, addCategory } from "../modules/categories";

export default function createCategoryAction(categoryAttributes) {
  return (dispatch) => {
    return requestCreateCategory(categoryAttributes).
    then((response) => {
      const category = response.data.category;
      dispatch(push(`/categories/${category.id}`));

      dispatch(addCategory({ category: category }));

      return response.data;
    }).
    catch((response) => {
      dispatch(categoryFormUpdate({ errors: response.data.errors }));
      return response.data;
    });
  };
}
