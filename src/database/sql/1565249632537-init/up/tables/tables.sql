CREATE TABLE users (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name CITEXT NOT NULL,
  last_name CITEXT NOT NULL,
  username CITEXT NOT NULL,
  email CITEXT NOT NULL,
  password TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  avatar TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT first_name_length CHECK(length(first_name) >= 3 AND length(first_name) < 30),
  CONSTRAINT last_name_length CHECK(length(last_name) >= 3 AND length(last_name) < 30),
  CONSTRAINT username_length CHECK(length(username) >= 3 AND length(username) < 30),
  CONSTRAINT unique_username UNIQUE(username),
  CONSTRAINT unique_email UNIQUE(email),
  CONSTRAINT date_of_birth_range CHECK(daterange(CURRENT_DATE - (365 * 100), CURRENT_DATE - (365 * 13)) @> date_of_birth)
);

CREATE TABLE email_verification_tokens (
  user_id UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  verification_token UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, verification_token)
);

CREATE TABLE example (
  id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  something TEXT,
  anotherthing TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);
