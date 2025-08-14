import Button from "../../atoms/button/Button";
import { useFormik } from "formik";
import { FaTimes, FaHashtag } from "react-icons/fa";
import { useModalStore } from "../../../store/ModalStore";
import { useAuthStore } from "../../../store/AuthStore";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import "./SignInForm.scss";
import { useEffect } from "react";

const ActivateAccountForm = () => {
  const { closeModal, openModal, modalProps } = useModalStore();
  const email = modalProps?.email;

  const activateAccount = useAuthStore((state) => state.activateAccount);
  const loading = useAuthStore((state) => state.loading);
  const clearAuthStatus = useAuthStore((state) => state.clearAuthStatus);

  useEffect(() => {
    if (!email) {
      toast.error("An unexpected error occurred. Please try again from the beginning.");
      closeModal();
    }
  }, [email, closeModal]);


  const formik = useFormik({
    initialValues: {
      activationCode: "",
    },
    validationSchema: Yup.object({
      activationCode: Yup.string().required("Activation code is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const response = await activateAccount(email, values.activationCode);
      if (response && response.data?.success) {
        toast.success("Your account has been successfully activated!");
        openModal('signIn'); 
      } else {
        const apiError = useAuthStore.getState().error;
        const errorMessage = Array.isArray(apiError) ? apiError.join(', ') : apiError || "Activation failed. Please check the code and try again.";
        toast.error(errorMessage);
      }
      setSubmitting(false);
    },
  });

  const handleFocus = (e) => {
    formik.setFieldError(e.target.name, '');
    clearAuthStatus();
  };

  const getIconClassName = (field) => {
    if (formik.touched[field] && formik.errors[field]) return "is-error";
    if (formik.touched[field] && !formik.errors[field]) return "is-success";
    return "";
  };

  return (
    <div className="sign-in-form__container">
      <Button
        onClick={closeModal}
        variant="submit md circle modal-close-button"
      >
        <FaTimes />
      </Button>
      <h2 className="sign-in-form__title">Activate Your Account</h2>

      <form onSubmit={formik.handleSubmit} className="sign-in-form__form">
        <p className="sign-in-form__description">
          An activation code has been sent to your email. Please enter it below to activate your account.
        </p>
        
        <div className="sign-in-form__group">
          <label htmlFor="activationCode" className="sign-in-form__label">
            Activation Code
          </label>
          <div className="sign-in-form__input-wrapper">
            <FaHashtag className={`sign-in-form__input-icon ${getIconClassName('activationCode')}`} />
            <input
              type="text"
              name="activationCode"
              id="activationCode"
              className={`sign-in-form__input ${getIconClassName('activationCode')}`}
              placeholder={formik.touched.activationCode && formik.errors.activationCode ? formik.errors.activationCode : "Enter your activation code"}
              value={formik.values.activationCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={handleFocus}
            />
          </div>
          {formik.touched.activationCode && formik.errors.activationCode ? (
                <p className="sign-in-form__error-message">{formik.errors.activationCode}</p>
            ) : null}
        </div>

        <Button type="submit" variant="submit" disabled={formik.isSubmitting || loading}>
          {loading ? 'Activating...' : 'Activate Account'}
        </Button>
      </form>
    </div>
  );
};

export default ActivateAccountForm;