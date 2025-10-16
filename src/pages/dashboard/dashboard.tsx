import  { useMemo } from "react";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../api/usersApi";
import { Box, Typography, Paper } from "@mui/material";
import type {ApexOptions} from "apexcharts";

const Dashboard = () => {
    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,
    });

    const roleCounts = useMemo(() => {
        const counts = { admin: 0, manager: 0, user: 0 };
        users.forEach((u) => {
            if (u.role === "admin") counts.admin++;
            else if (u.role === "manager") counts.manager++;
            else if (u.role === "user") counts.user++;
        });
        return counts;
    }, [users]);

    const options: ApexOptions = {
        chart: {
            type: "pie",
            width: 380,
        },
        labels: ["Admin", "Manager", "User"],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 250,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };


    const series = [roleCounts.admin, roleCounts.manager, roleCounts.user];

    if (isLoading) return <div>Загрузка...</div>;
    if (isError) return <div>Ошибка при загрузке пользователей</div>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                User Roles Overview
            </Typography>

            <Paper sx={{ p: 3, display: "flex", justifyContent: "center" }}>
                <Chart options={options} series={series} type="pie" width="380" />
            </Paper>
        </Box>
    );
};

export default Dashboard;
