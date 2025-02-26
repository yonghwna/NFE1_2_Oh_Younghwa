import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import LogoIcon from '../../../shared/components/atom/icons/LogoIcon';
import { postLoginRequest } from '../api/login';

import '../scss/loginform.scss';

// 폼 타입 정의
interface FormState {
  email: string;
  password: string;
}

// 오류 메시지 타입 정의
interface ErrorState {
  email?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const useLoginUsers = useMutation({
    mutationFn: postLoginRequest,
    onSuccess: (data) => {
      const { token } = data;
      localStorage.setItem('token', token);
      navigate('/posts/channel/home');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // 폼 상태 관리
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<ErrorState>({});

  // 입력값 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // 이메일 형식 확인 정규식
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password: string): boolean => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(String(password));
  };

  // 폼 검증 로직
  const validateForm = (): ErrorState => {
    const newErrors: ErrorState = {};

    if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!validatePassword(form.password)) {
      newErrors.password =
        'Password must be at least 8 characters long and include a mix of uppercase, lowercase, number, and special character.';
    }

    return newErrors;
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    //전송 누를 때 마다 오류 검증
    const validationErrors = validateForm();
    //검증 값으로 오류값 설정
    setErrors(validationErrors);
    //오류값의 프로퍼티가 하나라도 있으면 회원가입 불가
    if (Object.keys(validationErrors).length === 0) {
      useLoginUsers.mutate(form);
      // 서버로 데이터 전송 로직 추가 가능
    }
  };

  return (
    <div className="background">
      <div className="background-cover"></div>
      <div className="form-wrapper">
        <div className="form-title">
          <LogoIcon />
          <h1>로그인</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-content-wrapper">
            <div className="form-content">
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="oh@movie.com"
              />
              {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
            </div>

            <div className="form-content">
              <label htmlFor="password">Password</label>
              <br />
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
              />
              {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
            </div>
          </div>

          <button className="submit-button" type="submit">
            로그인
          </button>

          <div className="link-to-signup">
            <Link to="/signup">
              <span className="active">아직 오!영화 회원이 아닌가요?</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
