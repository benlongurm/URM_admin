import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Divider, Grid, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import { SxProps } from '@mui/material/styles';
import axios from 'axios';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import SectionChart from '../../section/SectionChart';
import SecurePolicyUpload from '../../section/SecurePolicyUpload';
import SectionTable from '../../section/SectionTable';
import HierarchicalBubbles from '../../section/Bubbles';

interface AnalysisData {
    map(arg0: (section: any, index: any) => React.JSX.Element): React.ReactNode;
    typedJsonData: Section[]
}

interface AnalysisViewProps {
    reqId: string;
    sx?: SxProps;
}

interface Section {
    id: number | string;
    type: 'section_normal' | 'section_key_metrics' | 'section_container' | 'section_chart' | 'section_text' | 'section_table' | 'section_upload';
    title?: string;
    description?: string;
    icon?: string;
    text?: string;
    alignSections?: 'vertical' | 'horizontal';
    sections?: Section[];
    items?: Item[];
    legend?: string[];
    categories: string[];
    data: ChartData | BubbleChartData;
    chartType: 'bar_vertical' | 'bar_horizontal' | 'line' | 'bubble_group' | 'bar_vertical_stacked';
    headers: string[];
    rows: TableRow[];
}

type ChartData = {
    [key: string]: number[];
};

export type BubbleChartData = BubbleParentGroup[];

interface BubbleSubgroup {
    text: string;
    value: number;
}

interface BubbleParentGroup {
    text: string;
    subgroups: BubbleSubgroup[];
}

interface Item {
    id: number;
    icon: string;
    text: string;
    subMetrics?: SubMetric[];
}

interface SubMetric {
    id: number;
    text: string;
}


interface TableRow {
    id: string;
    data: TableCell[];
}

interface TableCell {
    id: string;
    text: string;
}



interface Comment {
    id?: number | string;
    componentId?: number | string;
    x?: number;
    y?: number;
    text?: string;
    title?: string;
    description?: string;
}

// Props for SectionContent
interface SectionContentProps {
    section: Section;
    handleRightClick: (event: React.MouseEvent, section: Section) => void;
    comments: Comment[];
    activeComment: Comment | null;
    handleCommentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleCommentSubmit: () => void;
    handleEditComment: (index: number) => void;
    inputRef: React.RefObject<HTMLDivElement>;
}

// Component for rendering sections
const SectionContent: React.FC<SectionContentProps> = ({
    section,
    handleRightClick,
    comments,
    activeComment,
    handleCommentChange,
    handleCommentSubmit,
    handleEditComment,
    inputRef,
}) => {
    return (
        <Box key={section.id} sx={{ mb: 4, position: 'relative' }} onContextMenu={(event) => handleRightClick(event, section)}>
            <Box display="flex" alignItems="center">
                {section.icon && <img src={section.icon} alt="icon" style={{ width: 24, height: 24, marginRight: 8, marginBottom: '0.5em' }} />}
                <Typography variant="h3" fontWeight={700} gutterBottom style={{ fontSize: "1.5rem" }}>
                    {section.title}
                </Typography>
            </Box>
            <Typography variant="h4" fontWeight={300} style={{ fontSize: "1.1rem" }}>
                {section.description}
            </Typography>

            <Box sx={{ mb: 4 }}>
                {section.sections?.map((item, index) => (
                    <Box key={item.id} sx={{ mb: 2 }}>
                        {item.items?.map((subitem) => (
                            <Box key={subitem.id} sx={{ mb: 2, mt: 2 }}>
                                <Box display="flex" alignItems="center">
                                    {subitem.icon && <img src={subitem.icon} alt="icon" style={{ width: 24, height: 24, marginRight: 8 }} />}
                                    <Typography variant="h4" sx={{ fontSize: "1.1rem" }}>{subitem?.text}</Typography>
                                </Box>

                                {subitem.subMetrics?.map((sub) => (
                                    <Box key={sub.id}>
                                        <Typography variant="h6" sx={{ ml: 4, mt: 1, fontSize: "1rem" }}>
                                            {'-'}
                                            {sub?.text}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ))}

                        {item.title && (
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{ mt: 3, fontSize: "1rem", textAlign: section.title === 'Billd Insurance Pricing' && index % 2 === 1 ? 'right' : 'left' }}
                            >
                                {item.title}
                            </Typography>
                        )}

                        {item.description && (
                            <Typography variant="h6" fontWeight={300} sx={{ mt: 1, fontSize: "1rem" }}>
                                {item.description}
                            </Typography>
                        )}

                        {/* Render subsection content */}
                        {section.title !== 'Billd Insurance Pricing' &&
                            item.sections?.map((subsection) => (
                                <Box key={subsection.id} sx={{ mt: 4 }}>
                                    {subsection.type === 'section_chart' && (
                                        <SectionChart title={subsection.title} chartType={subsection.chartType} categories={subsection.categories} data={subsection.data as ChartData} />
                                    )}
                                </Box>
                            ))}

                        {section.title === 'Billd Insurance Pricing' && (
                            <Grid container spacing={3}>
                                {item.sections?.map((subsection) => (
                                    <>
                                        {index % 2 === 0 && (
                                            <>
                                                {subsection?.type === 'section_chart' && (
                                                    <Grid item sm={6} xl={6} xs={6}>
                                                        <SectionChart
                                                            key={subsection.id}
                                                            title={subsection.title}
                                                            chartType={subsection.chartType}
                                                            categories={subsection.categories}
                                                            data={subsection.data as ChartData}
                                                        />
                                                    </Grid>
                                                )}
                                                {subsection.type === 'section_text' && (
                                                    <Grid item sm={6} xl={6} xs={6}>
                                                        <Typography key={subsection.id} fontWeight="300" fontSize="1rem" variant="h6">{subsection?.text}</Typography>
                                                    </Grid>
                                                )}
                                            </>
                                        )}
                                        {index % 2 === 1 && (
                                            <>
                                                {subsection.type === 'section_text' && (
                                                    <Grid item sm={6} xl={6} xs={6}>
                                                        <Typography key={subsection.id} fontWeight="300" fontSize="1rem" variant="h6">{subsection?.text}</Typography>
                                                    </Grid>
                                                )}
                                                {subsection?.type === 'section_chart' && (
                                                    <Grid item sm={6} xl={6} xs={6}>
                                                        <SectionChart
                                                            key={subsection.id}
                                                            title={subsection.title}
                                                            chartType={subsection.chartType}
                                                            categories={subsection.categories}
                                                            data={subsection.data as ChartData}
                                                        />
                                                    </Grid>
                                                )}
                                            </>
                                        )}
                                    </>
                                ))}
                            </Grid>
                        )}

                        {/* Handle uploads, tables, and charts */}
                        {item.type === 'section_upload' && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <SecurePolicyUpload onFileSelect={() => { }} />
                            </Box>
                        )}

                        {item.type === 'section_table' && <SectionTable headers={item.headers} rows={item.rows} />}

                        {item.type === 'section_chart' && (
                            <SectionChart title={item.title} chartType={item.chartType} legend={item.legend} categories={item.categories} data={item.data as ChartData} />
                        )}

                        {item.type === 'section_chart' && item.chartType === 'bubble_group' && <HierarchicalBubbles key={item.id} data={item.data as BubbleChartData} />}
                    </Box>
                ))}
            </Box>

            <Divider sx={{ width: '90%', mx: 'auto', mt: '-20px' }} />

            {/* Comment input box */}
            {activeComment && activeComment.componentId === section.id && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: activeComment.y,
                        left: activeComment.x,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '20px',
                        padding: '5px',
                        zIndex: 10,
                        // width: {
                        //     xs: '200px',
                        //     sm: '60%',
                        //     md: '300px',
                        //     lg: '30%',
                        // },
                        width: '300px',
                        maxWidth: '250px',
                        minWidth: '50px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease-in-out',
                    }}
                    ref={inputRef}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                            value={activeComment.text}
                            onChange={handleCommentChange}
                            placeholder={`Add your comment on "${activeComment.title}"`}
                            multiline
                            rows={Math.min(Math.max(Math.floor((activeComment.text || '').length / 12), 1), 5)}
                            sx={{
                                width: '100%',
                                minHeight: '40px',
                                overflow: 'hidden',
                                transition: 'height 0.3s ease-in-out',
                                '& .MuiInputBase-root': {
                                    padding: '4 4px',
                                    height: 'auto',
                                    borderRadius: '15px',
                                },
                            }}
                        />
                        <Button onClick={handleCommentSubmit} variant="contained" color="primary" sx={{ borderRadius: '10px' }}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Render comment icons */}
            {comments.map((comment, index) => (
                comment.componentId === section.id && (
                    <IconButton
                        key={index}
                        sx={{
                            position: 'absolute',
                            top: comment.y,
                            left: comment.x,
                            padding: '10px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '50%',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                        }}
                        onClick={() => handleEditComment(index)}
                    >
                        <ModeCommentIcon sx={{ fontSize: '30px', color: '#555', transform: 'rotate(180deg)' }} />
                    </IconButton>
                )
            ))}
        </Box>
    );
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ reqId, sx }) => {
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [activeComment, setActiveComment] = useState<Comment | null>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    let isjsondata = false;

    const handleRightClick = (event: React.MouseEvent, section: Section) => {
        event.preventDefault();
        const boundingRect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - boundingRect.left;
        const y = event.clientY - boundingRect.top;

        setActiveComment({
            componentId: section.id,
            x,
            y,
            text: '',
            title: section.title,
            description: section.description,
        });
    };

    const handleCommentSubmit = () => {
        console.log(activeComment, 'activeComment');
        if (activeComment?.text?.trim() !== '') {
            if (!activeComment?.id) {
                console.log("sdsf")
                const newComment = {
                    ...activeComment,
                    id: new Date().getTime(), // Use a timestamp or any unique method for id
                };

                console.log(newComment, "newComment")

                setComments([...comments, newComment]);
                console.log(comments, "commentss")
            } else {
                setComments(comments.map((comment) => (comment.id === activeComment.id ? activeComment : comment)));
            }
        }
        else {
            // Remove the comment if it's empty
            if (activeComment.id) {
                setComments(comments.filter((comment) => comment.id !== activeComment.id));
            }
        }
        setActiveComment(null);
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (activeComment) {
            setActiveComment({ ...activeComment, text: event.target.value });
        }
    };

    const handleEditComment = (index: number) => {
        const comment = comments[index];
        setActiveComment(comment);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setActiveComment(null); // Close the comment input field
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    // console.log(isjsondata, "isjsondata")

    useEffect(() => {
        const fetchAnalysisData = async () => {
            try {
                // console.log(id, "id")
                // const orderIdNumber = id.match(/\d+/)?.[0];

                // Introduce a 3-second delay before making the API request
                await new Promise(resolve => setTimeout(resolve, 3000));

                const response = await axios.post(`http://localhost:5000/api/admin/analysis/${reqId}`);
                // console.log(response, "response")
                // console.log(response.data.jsondata, "response.data.jsondata")
                const dbData = response.data.jsondata.sections;
                setData(dbData);
            } catch (err) {
                setError('Failed to fetch analysis data.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysisData();
    }, [reqId]);

    // console.log(isjsondata, "isjsondata")

    if (data?.typedJsonData) { isjsondata = true; }


    // console.log()

    // console.log(data, "data")

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Full-screen center
                    animation: 'fadeIn 1s ease-in-out',
                    '@keyframes fadeIn': {
                        '0%': { opacity: 0 },
                        '100%': { opacity: 1 },
                    }
                }}
            >
                <CircularProgress size={50} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading, please wait...
                </Typography>
            </Box>
        );
    }

    if (error) return <Typography>{error}</Typography>;

    return (
        <Box
            bgcolor="grey.300" // Set background color to a shade of grey (Material-UI color)
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Box width={"40%"}
                bgcolor={"white"}
                display="flex"
                justifyContent="center"
                alignItems="center">
                <Box width={"90%"} >
                    <Grid
                        item
                        alignItems='center'
                        justifyContent='center'
                        container
                        spacing={3}
                        // xs={12}
                        style={{ marginTop: '-60px', marginBottom: '30px' }}
                    >
                        <Grid item style={{ alignItems: 'center' }}>
                            <Typography color={'black'} variant='h1' style={{ textAlign: 'center', fontSize: "6rem", marginTop: "30px" }}>
                                billd
                            </Typography>
                        </Grid>
                    </Grid>
                    {data && data?.map((section, index) => (
                        <SectionContent
                            key={section.id}
                            section={section}
                            handleRightClick={handleRightClick}
                            comments={comments}
                            activeComment={activeComment}
                            handleCommentChange={handleCommentChange}
                            handleCommentSubmit={handleCommentSubmit}
                            handleEditComment={handleEditComment}
                            inputRef={inputRef}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default AnalysisView;