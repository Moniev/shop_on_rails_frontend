import Button from "../../atoms/button/Button";
import { useFormik } from "formik";
import { FaTimes, FaEnvelope } from "react-icons/fa";
import { modalStore } from "../../../store/ModalStore";
import * as Yup from "yup";
import "./SignInForm.scss"; 

const ResetPasswordForm = () => {
  const { closeModal, openModal } = modalStore();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      alert("Password reset link sent! (Check the console for the email).");
      closeModal();
    },
  });

  const handleFocus = (e) => {
    const { name } = e.target;
    formik.setFieldError(name, '');
    formik.setFieldTouched(name, false, false);
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

        <Button type="submit" variant="submit" disabled={formik.isSubmitting}>
          Send Reset Link
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
