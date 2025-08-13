import Button from "../../atoms/button/Button";
import { useFormik } from "formik";
import { FaTimes, FaLock } from "react-icons/fa";
import { useModalStore } from "../../../store/ModalStore";
import { useAuthStore } from "../../../store/AuthStore";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import "./SignInForm.scss";
import { useEffect } from "react";

const CreateNewPasswordForm = () => {
  const { closeModal, openModal, modalProps } = useModalStore();
  const email = modalProps?.email;
  const resetCode = modalProps?.resetCode;
  const resetPasswordWithCode = useAuthStore((state) => state.confirmPasswordReset);
  const loading = useAuthStore((state) => state.loading);
  const clearAuthStatus = useAuthStore((state) => state.clearAuthStatus);

  useEffect(() => {
    if (!email || !resetCode) {
      toast.error("An unexpected error occurred. Please try again from the beginning.");
      closeModal();
    }
  }, [email, resetCode, closeModal]);


  const formik = useFormik({
    initialValues: {
      password: "",
      passwordConfirmation: ""
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords must match")
        .required("Password confirmation is required")
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const success = await resetPasswordWithCode({
        reset_code: resetCode,
        password: values.password,
        password_confirmation: values.passwordConfirmation
      });
      if (success) {
        toast.success("Password has been changed successfully! You can now log in.");
        openModal('signIn'); 
      } else {
        const apiError = useAuthStore.getState().error;
        const errorMessage = Array.isArray(apiError) ? apiError.join(', ') : apiError || "Failed to reset password.";
        toast.error(errorMessage);
      }
      setSubmitting(false);
    },
  });

  const handleFocus = (e) => {
    const { name } = e.target;
    formik.setFieldError(name, '');
    formik.setFieldTouched(name, false, false);
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
      <h2 className="sign-in-form__title">Set a New Password</h2>

      <form onSubmit={formik.handleSubmit} className="sign-in-form__form">
        <p className="sign-in-form__description">
          Your new password must be different from your old one.
        </p>
        
        <div className="sign-in-form__group">
          <label htmlFor="password" className="sign-in-form__label">
            New Password
          </label>
          <div className="sign-in-form__input-wrapper">
            <FaLock className={`sign-in-form__input-icon ${getIconClassName('password')}`} />
            <input
              type="password"
              name="password"
              id="password"
              className={`sign-in-form__input ${getIconClassName('password')}`}
              placeholder={formik.touched.password && formik.errors.password ? formik.errors.password : "Enter your new password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={handleFocus}
            />
          </div>
        </div>

        <div className="sign-in-form__group">
          <label htmlFor="passwordConfirmation" className="sign-in-form__label">
            Confirm New Password
          </label>
          <div className="sign-in-form__input-wrapper">
            <FaLock className={`sign-in-form__input-icon ${getIconClassName('passwordConfirmation')}`} />
            <input
              type="password"
              name="passwordConfirmation"
              id="passwordConfirmation"
              className={`sign-in-form__input ${getIconClassName('passwordConfirmation')}`}
              placeholder={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ? formik.errors.passwordConfirmation : "Confirm your new password"}
              value={formik.values.passwordConfirmation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={handleFocus}
            />
          </div>
        </div>

        <Button type="submit" variant="submit" disabled={formik.isSubmitting || loading}>
          {loading ? 'Saving...' : 'Save New Password'}
        </Button>
      </form>
    </div>
  );
};

export default CreateNewPasswordForm;