"""empty message

Revision ID: 17dcdb738ad9
Revises: 956cf226eb71
Create Date: 2025-05-11 12:36:56.248414

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '17dcdb738ad9'
down_revision = '956cf226eb71'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('devices', schema=None) as batch_op:
        batch_op.add_column(sa.Column('type', sa.String(length=50), nullable=False))
        batch_op.drop_column('device_type')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('devices', schema=None) as batch_op:
        batch_op.add_column(sa.Column('device_type', sa.VARCHAR(length=50), nullable=False))
        batch_op.drop_column('type')

    # ### end Alembic commands ###
