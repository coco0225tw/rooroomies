import mainImageAndImagesType from './UploadMainImageAndImagesType';
import { uploadImagesAction, uploadImagesActionType } from './UploadMainImageAndImagesAction';

const mainImageAndImagesEmptyState: mainImageAndImagesType = {
  mainImage: null,
  images: [],
};
export default function UploadImages(state = mainImageAndImagesEmptyState, action: uploadImagesActionType) {
  switch (action.type) {
    case uploadImagesAction.UPLOAD_IMAGES:
      return { ...state, images: action.payload.images };
    case uploadImagesAction.UPLOAD_MAIN_IMAGE:
      return { ...state, mainImage: action.payload.mainImage };
    case uploadImagesAction.DELETE_MAIN_IMAGE:
      return { ...state, mainImage: null };
    case uploadImagesAction.DELETE_OTHER_IMAGE:
      let newImages = [...state.images];
      let filterImages = newImages.filter((blob, index) => index !== action.payload.index);
      return { ...state, images: filterImages };
    case uploadImagesAction.RETURN_INITIAL_LISTING_IMAGES:
      return {
        mainImage: null,
        images: [],
      };
    default:
      return state;
  }
}
