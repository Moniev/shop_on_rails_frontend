import Button from "../../atoms/button/Button";
import { useFormik } from "formik";
import { FaTimes, FaEnvelope } from "react-icons/fa";
import { useModalStore } from "../../../store/ModalStore";
import { useAuthStore } from "../../../store/AuthStore";
import { toast } from 'react-toastify'; 
import * as Yup from "yup";
import "./SignInForm.scss"; 

const ResetPasswordForm = () => {
  const { closeModal, openModal } = useModalStore();
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const loading = useAuthStore((state) => state.loading);
  const clearAuthStatus = useAuthStore((state) => state.clearAuthStatus);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const success = await requestPasswordReset(values.email);
      if (success) {
        toast.success("Reset link sent! Please check your email.");
        resetForm();
      } else {
        const apiError = useAuthStore.getState().error;
        const errorMessage = Array.isArray(apiError) ? apiError.join(', ') : apiError || "Failed to send reset link. Please try again.";
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

  const handleSwitchToSignIn = () => {
    openModal('signIn');
  };

  const getIconClassName = (field) => {
    if (formik.touched[field] && formik.errors[field]) {
      return "is-error";
    }
    if (formik.touched[field] && !formik.errors[field]) {
      return "is-success";
    }
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
      <h2 className="sign-in-form__title">Reset Password</h2>

      <form onSubmit={formik.handleSubmit} className="sign-in-form__form">
        <p className="sign-in-form__description">
          Enter your email address and we will send you a link to reset your password.
        </p>
        <div className="sign-in-form__group">
          <label htmlFor="email" className="sign-in-form__label">
            Email
          </label>
          <div className="sign-in-form__input-wrapper">
            <FaEnvelope className={`sign-in-form__input-icon ${getIconClassName('email')}`} />
            <input
              type="email"
              name="email"
              id="email"
              className={`sign-in-form__input ${getIconClassName('email')}`}
              placeholder={formik.touched.email && formik.errors.email ? formik.errors.email : "Enter your email"}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={handleFocus}
            />
          </div>
        </div>

        <Button type="submit" variant="submit" disabled={formik.isSubmitting || loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="sign-in-form__footer">
        <p>Remember your password?
          <a onClick={handleSwitchToSignIn} className="sign-in-form__link">
             Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
