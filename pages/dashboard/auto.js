export async function getServerSideProps(context) {
  const { galleryid, g } = context.query;
  const target = galleryid || g;

  return {
    redirect: {
      destination: target ? `/dashboard/gallery?g=${target}` : '/dashboard/gallery',
      permanent: false,
    },
  };
}

const AutoRedirect = () => null;

export default AutoRedirect;
