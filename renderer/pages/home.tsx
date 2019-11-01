import React, { useState } from 'react';
import Head from 'next/head';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { ButtonAppBar, ImgMediaCard } from '../components'
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

const Home = () => {
  const classes = useStyles({});
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleClick = () => setOpen(true);

  return (
    <React.Fragment>
      <Head>
        <title>Atualizador</title>
      </Head>
      <ButtonAppBar></ButtonAppBar>
      <div className={classes.root}>
        <Box display="flex" flexDirection="column" flexWrap="wrap" justifyContent="center" width="100%">
          <ImgMediaCard></ImgMediaCard>
          <ImgMediaCard></ImgMediaCard>
        </Box>
      </div>
    </React.Fragment>
  );
};

export default Home;
