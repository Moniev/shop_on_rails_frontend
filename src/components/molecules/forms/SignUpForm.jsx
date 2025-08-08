import Button from "../../atoms/button/Button";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import * as Yup from "yup";
import "./SignInForm.scss";

const SignInForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log("Form data:", values);
      setTimeout(() => {
        alert("Sign Up submitted! Check console for form data.");
        setSubmitting(false);
      }, 500);
    },
  });

  const handleSocialLogin = (provider) => {
    alert(`Login with ${provider} initiated. Check console.`);
  };

  return (
    <div className="sign-in-form__container relative">
      <h2 className="sign-in-form__title">Sign Up</h2>
      <form
        onSubmit={formik.handleSubmit}
        className="sign-in-form__form flex justify-center"
      >
        <div className="sign-in-form__group relative">
          <label htmlFor="name" className="sign-in-form__label">
            Name
          </label>
          <FaUser
            className={`absolute left-3 top-1/2 mt-3 transform -translate-y-1/2 text-base inline-block align-middle ${
              formik.touched.name && formik.errors.name
                ? "text-red-500"
                : formik.touched.name && !formik.errors.name
                ? "text-green-500"
                : "text-cyan-600"
            }`}
          />
          <input
            type="text"
            name="name"
            id="name"
            className={`sign-in-form__input pl-10 ${
              formik.touched.name && formik.errors.name
                ? "input-error"
                : formik.touched.name && !formik.errors.name
                ? "input-success"
                : ""
            }`}
            placeholder={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : "Enter your name"
            }
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-describedby={
              formik.touched.name && formik.errors.name ? "name-error" : undefined
            }
          />
        </div>
        <div className="sign-in-form__group relative">
          <label htmlFor="email" className="sign-in-form__label">
            Email
          </label>
          <FaEnvelope
            className={`absolute left-3 top-1/2 mt-3 transform -translate-y-1/2 text-base inline-block align-middle ${
              formik.touched.email && formik.errors.email
                ? "text-red-500"
                : formik.touched.email && !formik.errors.email
                ? "text-green-500"
                : "text-cyan-600"
            }`}
          />
          <input
            type="email"
            name="email"
            id="email"
            className={`sign-in-form__input pl-10 ${
              formik.touched.email && formik.errors.email
                ? "input-error"
                : formik.touched.email && !formik.errors.email
                ? "input-success"
                : ""
            }`}
            placeholder={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : "Enter your email"
            }
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-describedby={
              formik.touched.email && formik.errors.email
                ? "email-error"
                : undefined
            }
          />
        </div>
        <div className="sign-in-form__group relative">
          <label htmlFor="password" className="sign-in-form__label">
            Password
          </label>
          <FaLock
            className={`absolute left-3 top-1/2 transform mt-3 -translate-y-1/2 text-base inline-block align-middle ${
              formik.touched.password && formik.errors.password
                ? "text-red-500"
                : formik.touched.password && !formik.errors.password
                ? "text-green-500"
                : "text-cyan-600"
            }`}
          />
          <input
            type="password"
            name="password"
            id="password"
            className={`sign-in-form__input pl-10 ${
              formik.touched.password && formik.errors.password
                ? "input-error"
                : formik.touched.password && !formik.errors.password
                ? "input-success"
                : ""
            }`}
            placeholder={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : "Enter your password"
            }
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-describedby={
              formik.touched.password && formik.errors.password
                ? "password-error"
                : undefined
            }
          />
        </div>
        <Button
          type="submit"
          variant="submit"
          disabled={formik.isSubmitting}
        >
          Submit
        </Button>
      </form>
      <div className="sign-in-form__reset-password mt-2 text-center">
        <a className="text-cyan-600 text-shadow-sky-100 font-bold">
          Register using outer services
        </a>
      </div>
      <div className="flex flex-row justify-center gap-4 mt-4">
        <Button
          variant="circle google"
          onClick={() => handleSocialLogin("Google")}
          aria-label="Sign up with Google"
        >
          <FaGoogle className="text-xl" />
        </Button>
        <Button
          variant="circle github"
          onClick={() => handleSocialLogin("GitHub")}
          aria-label="Sign up with GitHub"
        >
          <FaGithub className="text-xl" />
        </Button>
        <Button
          variant="circle twitter"
          onClick={() => handleSocialLogin("Twitter")}
          aria-label="Sign up with Twitter"
        >
          <FaTwitter className="text-xl" />
        </Button>
      </div>
      <div className="sign-in-form__reset-password mt-2 text-center">
        <Button onClick={() => navigate("/sign-in")}>
          <a className="text-cyan-600 text-shadow-sky-100 font-bold hover:underline hover:text-cyan-400">
            Already have an account? Sign in
          </a>
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;