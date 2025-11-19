export interface User {
  _id: string;
  name: string;
  email: string;
  profile_image: [
    {
      url: string;
      public_alt: string;
    }
  ];
}
