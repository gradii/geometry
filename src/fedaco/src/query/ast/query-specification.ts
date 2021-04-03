import { SqlNode } from '../sql-node';
import { SqlVisitor } from '../sql-visitor';
import { FromClause } from './from-clause';
import { GroupByClause } from './group-by-clause';
import { HavingClause } from './having-clause';
import { QueryExpression } from './query-expression';
import { SelectClause } from './select-clause';
import { WhereClause } from './where-clause';

/**
 * QueryExpression = SelectClause FromClause [WhereClause] [GroupByClause] [HavingClause] [OrderByClause]
 */
export class QuerySpecification extends QueryExpression {
  // public whereClause: WhereClause | null;
  // /**/
  // public groupByClause: GroupByClause | null;
  // /**/
  // public havingClause: HavingClause | null;
  // /**/
  // public orderByClause: OrderByClause | null;

  /**/
  public constructor(
    public selectClause: SelectClause,
    public fromClause?: FromClause,
    public whereClause?: WhereClause,
    public groupByClause?: GroupByClause,
    public havingClause?: HavingClause,
  ) {
    super();
  }

  /*{@inheritdoc}*/
  public accept(sqlVisitor: SqlVisitor) {
    return sqlVisitor.visitQuerySpecification(this);
  }
}
