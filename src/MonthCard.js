import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Config from './Config';
import { blueGrey } from '@material-ui/core/colors';
import { Card, CardHeader, IconButton, CardMedia, CardContent, Typography, LinearProgress, Table, TableBody, TableCell, TableRow, Chip, Avatar } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';

/**
 * 
 * @param {catMonth, accountValues} props 
 */
export default function MonthCard(props) {
  
  const dateTimeFormatMonthName = Intl.DateTimeFormat(Config.locale,Config.dateTimeFormatMonthName);
  
  const useStyles = makeStyles((theme) => ({
    cardMedia: {
      objectPosition: "50% 66%"

    },
    futureCard:{
      backgroundColor: blueGrey[100]
    },
    spacer : {
      flexGrow:1
    },
    
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    tableCells:
    {
      padding: "6px 1px 6px 16px"
    }
  }));

  const classes = useStyles();
  return (
<Card className={props.monthCategories.isInFuture() ? classes.futureCard : classes.root} variant={props.monthCategories.isInFuture() ? "outlined" : "elevation" }>
                  
                    <CardHeader title={dateTimeFormatMonthName.format(new Date(props.monthCategories.year,props.monthCategories.month,1)).split(" ").join("\u00a0")}
                      action={
                        <IconButton aria-label="settings" onClick={e => props.menuToggle(e,props.monthCategories)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    >
                    </CardHeader>
                    
                       <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={Config.getMonthImageUrl(props.monthCategories)}
          className={classes.cardMedia}
          title="Contemplative Reptile"
        />
                    <CardContent align="left">
                      
                      <Typography gutterBottom variant="subtitle2">
                        <Grid container>
                          <Grid item>Percent of Money spent:</Grid>
                          <Grid item className={classes.spacer} />
                          <Grid item>{Math.min(100,(props.monthCategories.totalsSum / props.accounts.getTargetValueMonth(props.monthCategories)) * 100).toFixed(2)}%</Grid>
                        </Grid>
                      <LinearProgress variant="determinate" name="moneySpent" 
                      value={Math.min(100,(props.monthCategories.totalsSum / props.accounts.getTargetValueMonth(props.monthCategories)) * 100)} 
                      color={(props.monthCategories.totalsSum / props.accounts.getTargetValueMonth(props.monthCategories)) > Config.criticalThreshold ? "secondary" : "primary"} />
                        <Grid container>
                          <Grid item>Percent of Month Past:</Grid>
                          <Grid item className={classes.spacer} />
                          <Grid item>{(props.monthCategories.timePast() * 100).toFixed(2)}%</Grid>
                        </Grid>
                      <LinearProgress variant="determinate" name="monthPast" value={props.monthCategories.timePast() * 100} />
                      </Typography>
                      <Table size="small" className={classes.table} aria-label="simple table">
                        <TableBody>
                        {props.accounts.categories.map((category) =>
                          <TableRow key={category}>
                            <TableCell className={classes.tableCells}>
                            <Chip label={category} variant="outlined" size="small" avatar={<Avatar src={Config.staticAssets +"/categories/" + category.toLowerCase().replace(" ","-") + ".png"} />} /></TableCell>
                            <TableCell className={props.accounts.getTargetStatus(props.monthCategories.tid, category,props.monthCategories.getValueInCategory(category) ?? 0) === "CRIT" ? classes.critical:classes.root, classes.tableCells} align="right">{Config.toCurrencyValue(props.monthCategories.getValueInCategory(category) ?? 0)}</TableCell>
                            <TableCell align="right">{Config.toCurrencyValue(props.accounts.getTargetValue(props.monthCategories.tid, category))}</TableCell>
                          </TableRow>
                        )}
                          <TableRow key="tots">
                            <TableCell></TableCell>
                            <TableCell className={(props.monthCategories.totalsSum / props.accounts.getTargetValueMonth(props.monthCategories)) > Config.criticalThreshold ? classes.critical:classes.root, classes.tableCells} align="right">
                              <strong>{Config.toCurrencyValue(props.monthCategories.totalsSum)}</strong></TableCell>
                            <TableCell align="right"><strong>{Config.toCurrencyValue(props.accounts.getTargetValueMonth(props.monthCategories))}</strong></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
  );
}